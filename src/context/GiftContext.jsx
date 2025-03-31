import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from './AuthContext';

const GiftContext = createContext();

export const GiftContextProvider = ({ children }) => {
  const { session } = UserAuth();
  const [sentGifts, setSentGifts] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch gifts when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      fetchGifts();
    }
  }, [session]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      
      // Fetch sent gifts
      const { data: sentData, error: sentError } = await supabase
        .from('gift_transactions')
        .select(`
          *,
          gift:gifts(*),
          recipient:profiles!recipient_id(email)
        `)
        .eq('sender_id', session.user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      // Fetch received gifts
      const { data: receivedData, error: receivedError } = await supabase
        .from('gift_transactions')
        .select(`
          *,
          gift:gifts(*),
          sender:profiles!sender_id(email)
        `)
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      setSentGifts(sentData || []);
      setReceivedGifts(receivedData || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendGift = async (giftId, recipientEmail, message) => {
    try {
      setLoading(true);
      setError(null);

      // First, get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to send a gift');
      }

      // Normalize the email
      const normalizedEmail = recipientEmail.toLowerCase().trim();
      console.log('Looking up recipient with normalized email:', normalizedEmail);

      // First, let's check if we can see any profiles at all
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .limit(5);
      
      console.log('Sample of profiles in table:', allProfiles);

      // Get the recipient's user ID from profiles table
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      console.log('Recipient lookup result:', { recipientData, recipientError });

      if (recipientError) {
        console.error('Recipient lookup error:', recipientError);
        throw new Error('Error looking up recipient: ' + recipientError.message);
      }

      if (!recipientData) {
        console.error('No recipient found for email:', normalizedEmail);
        throw new Error('Recipient not found. Please make sure they have signed up for UnboxMe.');
      }

      // Create the gift transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('gift_transactions')
        .insert([
          {
            sender_id: user.id,
            recipient_id: recipientData.id,
            gift_id: giftId,
            message: message,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
        throw new Error('Error creating gift transaction: ' + transactionError.message);
      }

      // Update local state
      setSentGifts(prev => [...prev, transaction]);

      return { success: true, data: transaction };
    } catch (error) {
      console.error('Error sending gift:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendThanks = async (giftId) => {
    try {
      const { data, error } = await supabase
        .from('gift_transactions')
        .update({ status: 'accepted' })
        .eq('id', giftId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setReceivedGifts(prev => 
        prev.map(gift => 
          gift.id === giftId ? { ...gift, status: 'accepted' } : gift
        )
      );

      return { success: true, data };
    } catch (error) {
      console.error('Error sending thanks:', error);
      return { success: false, error };
    }
  };

  return (
    <GiftContext.Provider value={{
      sentGifts,
      receivedGifts,
      loading,
      error,
      sendGift,
      sendThanks,
      fetchGifts
    }}>
      {children}
    </GiftContext.Provider>
  );
};

export const useGifts = () => {
  return useContext(GiftContext);
}; 