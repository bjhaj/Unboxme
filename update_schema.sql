-- Drop existing tables if they exist
DROP TABLE IF EXISTS gift_transactions;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Create gifts table
CREATE TABLE gifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gift_name TEXT NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2),
    Genre TEXT,
    Brand TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gift_transactions table with references to profiles
CREATE TABLE gift_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) NOT NULL,
    recipient_id UUID REFERENCES profiles(id) NOT NULL,
    gift_id UUID REFERENCES gifts(id) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Add new policy for email lookups (needed for gift sending)
CREATE POLICY "Users can view emails for gift sending"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- Create policies for gifts table
CREATE POLICY "Allow public read access to gifts"
    ON gifts FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for gift_transactions table
CREATE POLICY "Users can view their own gift transactions"
    ON gift_transactions FOR SELECT
    TO authenticated
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = recipient_id
    );

CREATE POLICY "Users can create gift transactions"
    ON gift_transactions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received gift transactions"
    ON gift_transactions FOR UPDATE
    TO authenticated
    USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name'
    );
    RETURN new;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop existing rows from tables in correct order
TRUNCATE TABLE gift_transactions CASCADE;
TRUNCATE TABLE gifts CASCADE;

-- Insert Romantic gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Luxury Silk Robe', 'Elegant silk robe perfect for romantic evenings', 89.99, 'Romantic', 'Silk & Lace'),
('Couples Spa Gift Set', 'Luxurious spa set for two with massage oils and bath salts', 129.99, 'Romantic', 'Love & Care'),
('Heart Necklace', 'Delicate 14k gold heart pendant necklace', 149.99, 'Romantic', 'Jewelry Co'),
('Romantic Dinner Set', 'Complete dinner set for two with wine glasses', 79.99, 'Romantic', 'Home & Heart'),
('Love Letter Box', 'Beautiful wooden box for storing love letters', 49.99, 'Romantic', 'Memory Box');

-- Insert Birthday gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Birthday Cake Kit', 'Complete kit to bake a delicious birthday cake', 39.99, 'Birthday', 'Bake & Joy'),
('Party Decorations Set', 'Colorful balloons, banners, and party favors', 29.99, 'Birthday', 'Party Time'),
('Birthday Photo Album', 'Customizable photo album for birthday memories', 49.99, 'Birthday', 'Memory Makers'),
('Birthday Gift Basket', 'Assorted treats and goodies for celebration', 69.99, 'Birthday', 'Gift Baskets Plus'),
('Birthday Message Board', 'LED message board for birthday wishes', 59.99, 'Birthday', 'Tech Gifts');

-- Insert Work gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Professional Leather Portfolio', 'Classic leather portfolio for documents', 89.99, 'Work', 'Office Pro'),
('Wireless Mouse & Keyboard Set', 'Ergonomic wireless mouse and keyboard', 79.99, 'Work', 'Tech Essentials'),
('Desk Organizer Set', 'Complete desk organization solution', 49.99, 'Work', 'Office Solutions'),
('Coffee Maker', 'Programmable coffee maker for the office', 69.99, 'Work', 'Coffee Masters'),
('Standing Desk Mat', 'Ergonomic mat for standing desks', 39.99, 'Work', 'Ergo Works');

-- Insert Self-Care gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Aromatherapy Diffuser', 'Ultrasonic essential oil diffuser', 49.99, 'Self-Care', 'Wellness Co'),
('Meditation Cushion Set', 'Comfortable cushions for meditation', 59.99, 'Self-Care', 'Zen Living'),
('Bath & Body Gift Set', 'Luxurious bath products set', 79.99, 'Self-Care', 'Spa Essentials'),
('Yoga Mat & Block Set', 'Premium yoga mat with blocks', 69.99, 'Self-Care', 'Yoga Life'),
('Sleep Mask & Ear Plugs', 'Comfortable sleep accessories', 29.99, 'Self-Care', 'Sleep Well');

-- Insert Child gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Educational Building Blocks', 'Colorful blocks for learning and play', 39.99, 'Child', 'Learn & Play'),
('Art Supply Kit', 'Complete art supplies for creative kids', 49.99, 'Child', 'Creative Kids'),
('Interactive Story Book', 'Electronic story book with sounds', 59.99, 'Child', 'Story Time'),
('Science Experiment Kit', 'Fun science experiments for kids', 69.99, 'Child', 'Science Kids'),
('Musical Instrument Set', 'Basic musical instruments for kids', 79.99, 'Child', 'Music Makers');

-- Insert Friend gifts
INSERT INTO gifts (gift_name, description, price, genre, brand) VALUES
('Friendship Bracelet Set', 'Matching friendship bracelets', 29.99, 'Friend', 'Friends Forever'),
('Movie Night Kit', 'Complete kit for movie night with friends', 49.99, 'Friend', 'Movie Time'),
('Board Game Collection', 'Set of classic board games', 69.99, 'Friend', 'Game Night'),
('Photo Frame Set', 'Set of frames for friend photos', 39.99, 'Friend', 'Memory Lane'),
('Gourmet Snack Box', 'Assorted gourmet snacks for sharing', 59.99, 'Friend', 'Snack Time');

-- Insert sample gift data
INSERT INTO gifts (gift_name, Description, Price, Genre, Brand) VALUES
('Gaming Mouse', 'High-precision gaming mouse with RGB lighting', 49.99, 'Electronics', 'GamingPro'),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 129.99, 'Electronics', 'SoundMaster'),
('Smart Watch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 'Electronics', 'TechFit'),
('Coffee Maker', 'Programmable coffee maker with thermal carafe', 79.99, 'Home', 'BrewMaster'),
('Yoga Mat', 'Premium non-slip yoga mat with carrying strap', 29.99, 'Fitness', 'FlexFit');

-- Insert profiles for existing users
INSERT INTO profiles (id, email, first_name, last_name)
SELECT id, email, raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name'
FROM auth.users
ON CONFLICT (id) DO NOTHING; 