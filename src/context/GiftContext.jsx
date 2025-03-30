import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserAuth } from './AuthContext';

const GiftContext = createContext();

export const GiftContextProvider = ({ children }) => {
  const { session } = UserAuth();
  const [sentGifts, setSentGifts] = useState([]);
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        .from('gifts')
        .select('*')
        .eq('sender_id', session.user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      // Fetch received gifts
      const { data: receivedData, error: receivedError } = await supabase
        .from('gifts')
        .select('*')
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
      // First, get the recipient's user ID from their email
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', recipientEmail)
        .single();

      if (recipientError) throw recipientError;
      if (!recipientData) throw new Error('Recipient not found');

      // Create the gift
      const { data, error } = await supabase
        .from('gifts')
        .insert([
          {
            sender_id: session.user.id,
            recipient_id: recipientData.id,
            gift_id: giftId,
            message: message,
            status: 'sent'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSentGifts(prev => [data, ...prev]);

      return { success: true, data };
    } catch (error) {
      console.error('Error sending gift:', error);
      return { success: false, error };
    }
  };

  const sendThanks = async (giftId) => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .update({ thanks_sent: true })
        .eq('id', giftId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setReceivedGifts(prev => 
        prev.map(gift => 
          gift.id === giftId ? { ...gift, thanks_sent: true } : gift
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