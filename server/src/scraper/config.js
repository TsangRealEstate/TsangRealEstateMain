module.exports = {
  // Location
  state: "tx",
  city: "san-antonio",
  
  // Bedrooms
  beds: 1, // Options: 0 (studio), 1, 2, 3+
  
  // Bathrooms
  baths: 1, // Options: 1, 2, 3+
  
  // Price range
  minPrice: 1100, // In dollars (no symbols)
  maxPrice: 6500, // In dollars (no symbols)
  
  // Move-in date (format: YYYY-MM-DD)
  moveInDate: "", // Leave empty for no preference
  
  // Amenities (all available options)
  amenities: [
    "has_air_conditioning",
    "has_dishwasher",
    "accessible",
    "bbq_grill",
    // "balcony_deck_patio",
    // "bathtub",
    // "business_center",
    // "carpet",
    // "carport",
    // "cat_friendly",
    // "ceiling_fan",
    // "dog_friendly",
    // "pet_friendly",
    // "doorman",
    // "elevator",
    // "fireplace",
    // "furnished",
    // "garage",
    // "garbage_disposal",
    // "granite_counters",
    // "gym",
    // "hardwood_floors",
    // "heat_included",
    // "hot_tub",
    // "ice_maker",
    // "in_unit_laundry",
    // "on_site_laundry",
    // "parking",
    // "pool",
    // "stainless_steel",
    // "walk_in_closet",
    // "washer_dryer_connections"
  ],
  
  // Commute location (optional)
  commuteLocation: "", // e.g. "School of Visual Arts, 209 E 23rd St, New York, NY 10010, USA"
  
  // Sorting options (if needed)
  sort: "recommended" // Options: "recommended", "price_low", "price_high", "newest"
};