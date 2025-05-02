const mongoose = require('mongoose');
const PopularPlace = require('../models/PopularPlace');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding popular places'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedPopularPlaces = async () => {
  try {
    // Delete existing data
    await PopularPlace.deleteMany({});
    console.log('Deleted existing popular places');
    
    const popularPlaces = [
      {
        destination: 'Delhi',
        places: [
          { 
            id: "delhi1", 
            name: "Red Fort", 
            description: "Historic fort built in the 17th century",
            image: "https://images.unsplash.com/photo-1585484173186-5f8757105b25?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "delhi2", 
            name: "Qutub Minar", 
            description: "UNESCO World Heritage site with a 73-meter tall tower",
            image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "delhi3", 
            name: "India Gate", 
            description: "War memorial in the heart of Delhi",
            image: "https://images.unsplash.com/photo-1586183189334-1393e5f2cb0d?q=80&w=1469&auto=format&fit=crop"
          },
          { 
            id: "delhi4", 
            name: "Lotus Temple", 
            description: "Stunning Bahá'í House of Worship shaped like a lotus flower",
            image: "https://images.unsplash.com/photo-1580188911874-f95af12a219d?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "delhi5", 
            name: "Humayun's Tomb", 
            description: "Magnificent tomb that inspired the Taj Mahal",
            image: "https://images.unsplash.com/photo-1610469385253-ef7144245faa?q=80&w=1470&auto=format&fit=crop"
          }
        ]
      },
      {
        destination: 'Manali',
        places: [
          { 
            id: "manali1", 
            name: "Solang Valley", 
            description: "Adventure sports hub with skiing and paragliding",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "manali2", 
            name: "Hadimba Temple", 
            description: "Ancient wooden temple dedicated to Goddess Hadimba",
            image: "https://images.unsplash.com/photo-1573388545311-d8d079204b2d?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "manali3", 
            name: "Rohtang Pass", 
            description: "High mountain pass with breathtaking views",
            image: "https://images.unsplash.com/photo-1518259102261-391241e57e2b?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "manali4", 
            name: "Old Manali", 
            description: "Charming village with cafes and vibrant atmosphere",
            image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1470&auto=format&fit=crop"
          },
          { 
            id: "manali5", 
            name: "Jogini Waterfall", 
            description: "Beautiful waterfall surrounded by pine forests",
            image: "https://images.unsplash.com/photo-1688749432924-1c324e506f00?q=80&w=1470&auto=format&fit=crop"
          }
        ]
      }
    ];

    // Insert data
    await PopularPlace.insertMany(popularPlaces);
    console.log('Successfully seeded popular places');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding popular places:', error);
    process.exit(1);
  }
};

seedPopularPlaces();