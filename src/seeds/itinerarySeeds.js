const mongoose = require('mongoose');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding itineraries'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to get a random trip manager user ID
const getTripManagerId = async () => {
  try {
    // Find a user with trip_manager role
    const tripManager = await User.findOne({ role: 'trip_manager' });
    
    if (!tripManager) {
      console.log('No trip manager found. Creating a default one...');
      // Create a trip manager if none exists
      const newManager = new User({
        name: 'Default Manager',
        email: 'manager@journeycraft.com',
        password: await bcrypt.hash('password123', 10),
        role: 'trip_manager'
      });
      await newManager.save();
      return newManager._id;
    }
    
    return tripManager._id;
  } catch (error) {
    console.error('Error finding trip manager:', error);
    process.exit(1);
  }
};

// Create seed data
const seedItineraries = async () => {
  try {
    // Delete existing itineraries
    await Itinerary.deleteMany({});
    console.log('Deleted existing itineraries');
    
    const managerId = await getTripManagerId();
    
    // Create itineraries with dates from April 16 to April 24, 2025
    const itineraries = [
      {
        title: 'Magical Manali Getaway',
        description: 'Experience the beauty of Manali with this comprehensive tour package that covers all the major attractions.',
        user: managerId,
        organizer: managerId,
        destinations: [
          {
            location: 'Manali',
            arrivalDate: new Date('2025-04-16'),
            departureDate: new Date('2025-04-19'),
            accommodation: 'Hotel Mountain View'
          },
          {
            location: 'Solang Valley',
            arrivalDate: new Date('2025-04-19'),
            departureDate: new Date('2025-04-21'),
            accommodation: 'Alpine Retreat Resort'
          }
        ],
        events: [
          {
            name: 'Hadimba Temple Visit',
            date: new Date('2025-04-17'),
            location: 'Manali',
            description: 'Visit the ancient Hadimba Temple with a guided tour'
          },
          {
            name: 'River Rafting',
            date: new Date('2025-04-18'),
            location: 'Beas River',
            description: 'Exciting white water rafting experience'
          },
          {
            name: 'Paragliding Session',
            date: new Date('2025-04-20'),
            location: 'Solang Valley',
            description: 'Experience paragliding with professional instructors'
          }
        ],
        price: 18500,
        days: 6,
        nights: 5,
        rewardPoints: 200,
        status: 'Published',
        startDate: new Date('2025-04-16'),
        endDate: new Date('2025-04-21'),
        destination: 'Manali, Himachal Pradesh',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Royal Rajasthan Tour',
        description: 'Experience the royal heritage of Rajasthan with this cultural tour covering Jaipur and Udaipur.',
        user: managerId,
        organizer: managerId,
        destinations: [
          {
            location: 'Jaipur',
            arrivalDate: new Date('2025-04-17'),
            departureDate: new Date('2025-04-20'),
            accommodation: 'Heritage Palace Hotel'
          },
          {
            location: 'Udaipur',
            arrivalDate: new Date('2025-04-20'),
            departureDate: new Date('2025-04-23'),
            accommodation: 'Lake View Resort'
          }
        ],
        events: [
          {
            name: 'Amber Fort Tour',
            date: new Date('2025-04-18'),
            location: 'Jaipur',
            description: 'Guided tour of the historic Amber Fort'
          },
          {
            name: 'City Palace Visit',
            date: new Date('2025-04-21'),
            location: 'Udaipur',
            description: 'Explore the magnificent City Palace'
          }
        ],
        price: 24500,
        days: 7,
        nights: 6,
        rewardPoints: 250,
        status: 'Published',
        startDate: new Date('2025-04-17'),
        endDate: new Date('2025-04-23'),
        destination: 'Rajasthan',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1470&auto=format&fit=crop'
      },
      {
        title: 'Goa Beach Vacation',
        description: 'Relax and enjoy the beautiful beaches of Goa with this perfect beach vacation package.',
        user: managerId,
        organizer: managerId,
        destinations: [
          {
            location: 'North Goa',
            arrivalDate: new Date('2025-04-18'),
            departureDate: new Date('2025-04-21'),
            accommodation: 'Beachside Resort'
          },
          {
            location: 'South Goa',
            arrivalDate: new Date('2025-04-21'),
            departureDate: new Date('2025-04-24'),
            accommodation: 'Luxury Beach Resort'
          }
        ],
        events: [
          {
            name: 'Water Sports Day',
            date: new Date('2025-04-19'),
            location: 'Baga Beach',
            description: 'Experience various water sports activities'
          },
          {
            name: 'Sunset Cruise',
            date: new Date('2025-04-22'),
            location: 'Mandovi River',
            description: 'Enjoy a relaxing sunset cruise with dinner'
          }
        ],
        price: 22000,
        days: 7,
        nights: 6,
        rewardPoints: 220,
        status: 'Published',
        startDate: new Date('2025-04-18'),
        endDate: new Date('2025-04-24'),
        destination: 'Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1474&auto=format&fit=crop'
      },
      {
        title: 'Kerala Backwaters Experience',
        description: 'Discover the serene backwaters of Kerala with this relaxing tour package.',
        user: managerId,
        organizer: managerId,
        destinations: [
          {
            location: 'Kochi',
            arrivalDate: new Date('2025-04-16'),
            departureDate: new Date('2025-04-18'),
            accommodation: 'Waterfront Hotel'
          },
          {
            location: 'Alleppey',
            arrivalDate: new Date('2025-04-18'),
            departureDate: new Date('2025-04-21'),
            accommodation: 'Houseboat Stay'
          },
          {
            location: 'Munnar',
            arrivalDate: new Date('2025-04-21'),
            departureDate: new Date('2025-04-23'),
            accommodation: 'Tea Estate Resort'
          }
        ],
        events: [
          {
            name: 'Fort Kochi Tour',
            date: new Date('2025-04-17'),
            location: 'Kochi',
            description: 'Explore the historic Fort Kochi area'
          },
          {
            name: 'Backwater Cruise',
            date: new Date('2025-04-19'),
            location: 'Alleppey',
            description: 'Full day backwater cruise'
          },
          {
            name: 'Tea Plantation Visit',
            date: new Date('2025-04-22'),
            location: 'Munnar',
            description: 'Visit tea plantations and spice gardens'
          }
        ],
        price: 27500,
        days: 8,
        nights: 7,
        rewardPoints: 275,
        status: 'Published',
        startDate: new Date('2025-04-16'),
        endDate: new Date('2025-04-23'),
        destination: 'Kerala',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1632&auto=format&fit=crop'
      },
      {
        title: 'Andaman Island Paradise',
        description: 'Explore the pristine beaches and coral reefs of the Andaman Islands.',
        user: managerId,
        organizer: managerId,
        destinations: [
          {
            location: 'Port Blair',
            arrivalDate: new Date('2025-04-19'),
            departureDate: new Date('2025-04-21'),
            accommodation: 'Seaside Resort'
          },
          {
            location: 'Havelock Island',
            arrivalDate: new Date('2025-04-21'),
            departureDate: new Date('2025-04-24'),
            accommodation: 'Beach Cottages'
          }
        ],
        events: [
          {
            name: 'Cellular Jail Visit',
            date: new Date('2025-04-20'),
            location: 'Port Blair',
            description: 'Historical tour of the Cellular Jail'
          },
          {
            name: 'Scuba Diving',
            date: new Date('2025-04-22'),
            location: 'Havelock Island',
            description: 'Scuba diving experience at Radhanagar Beach'
          }
        ],
        price: 32000,
        days: 6,
        nights: 5,
        rewardPoints: 320,
        status: 'Published',
        startDate: new Date('2025-04-19'),
        endDate: new Date('2025-04-24'),
        destination: 'Andaman Islands',
        image: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?q=80&w=1374&auto=format&fit=crop'
      }
    ];

    // Insert itineraries into the database
    await Itinerary.insertMany(itineraries);
    console.log('Successfully seeded itineraries');
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedItineraries();