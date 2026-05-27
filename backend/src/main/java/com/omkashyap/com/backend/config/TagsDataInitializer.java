package com.omkashyap.com.backend.config;

import com.omkashyap.com.backend.entity.Tags;
import com.omkashyap.com.backend.repository.TagsRepository;
import com.omkashyap.com.backend.util.TagsUtil;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TagsDataInitializer implements CommandLineRunner {

  private final TagsRepository tagsRepository;
  private final TagsUtil tagsUtil;

  @Override
  public void run(String @NonNull ... args) {

    List<String> defaultTags = List.of(

        // Electronics
        "Electronics",
        "Mobile",
        "Smartphone",
        "Laptop",
        "Computer",
        "Tablet",
        "Smart Watch",
        "Headphones",
        "Bluetooth Speaker",
        "Camera",
        "Gaming",
        "Gaming Console",
        "Keyboard",
        "Mouse",
        "Monitor",
        "Printer",
        "Accessories",
        "Power Bank",
        "Charger",
        "USB Cable",

        // Fashion
        "Fashion",
        "Men Clothing",
        "Women Clothing",
        "Kids Clothing",
        "Shoes",
        "Sneakers",
        "Sandals",
        "Watch",
        "Jewelry",
        "Bags",
        "Wallet",
        "Sunglasses",
        "T-Shirt",
        "Jeans",
        "Jacket",
        "Hoodie",

        // Home & Furniture
        "Home",
        "Furniture",
        "Kitchen",
        "Home Decor",
        "Lighting",
        "Sofa",
        "Chair",
        "Table",
        "Bed",
        "Mattress",
        "Wardrobe",
        "Curtains",
        "Carpet",

        // Beauty
        "Beauty",
        "Skincare",
        "Haircare",
        "Makeup",
        "Perfume",
        "Cosmetics",
        "Face Wash",
        "Shampoo",
        "Beard Care",

        // Sports & Fitness
        "Sports",
        "Fitness",
        "Gym",
        "Yoga",
        "Cricket",
        "Football",
        "Badminton",
        "Cycling",
        "Running",
        "Dumbbells",
        "Protein",

        // Books
        "Books",
        "Education",
        "Novel",
        "Comics",
        "Biography",
        "Programming",
        "Java",
        "Spring Boot",
        "Technology",

        // Grocery
        "Grocery",
        "Food",
        "Snacks",
        "Beverages",
        "Organic",
        "Dry Fruits",
        "Tea",
        "Coffee",

        // Automobile
        "Automobile",
        "Bike",
        "Car",
        "Helmet",
        "Car Accessories",
        "Engine Oil",
        "Tyres",

        // Baby
        "Baby",
        "Baby Care",
        "Toys",
        "Diapers",
        "Baby Food",

        // Pet
        "Pet",
        "Pet Food",
        "Dog",
        "Cat",
        "Pet Accessories",

        // Office
        "Office",
        "Stationery",
        "Office Chair",
        "Office Desk",
        "Notebook",
        "Pen",

        // Misc
        "Trending",
        "Best Seller",
        "New Arrival",
        "Discount",
        "Limited Edition",
        "Premium",
        "Luxury",
        "Handmade",
        "Eco Friendly"
    );

    defaultTags.forEach(tag -> {
      if (!tagsRepository.existsByTagName(tag)) {
        Tags tags = Tags.builder()
            .tagName(tag)
            .slug(tagsUtil.generateSlugByTagName(tag))
            .build();

        tagsRepository.save(tags);
      }
    });
  }
}