package com.omkashyap.com.backend.config;

import com.omkashyap.com.backend.entity.Category;
import com.omkashyap.com.backend.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryInitializer implements CommandLineRunner {

  private final CategoryRepository categoryRepository;

  @Override
  @Transactional
  public void run(String @NonNull ... args) {

    // Prevent duplicate initialization
    if (categoryRepository.count() > 0) {
      return;
    }

    Category electronics =
        new Category("ELECTRONICS", null);

    Category fashion =
        new Category("FASHION", null);

    Category grocery =
        new Category("GROCERY", null);

    Category books =
        new Category("BOOKS", null);

    Category furniture =
        new Category("FURNITURE", null);

    Category kitchen =
        new Category("KITCHEN", null);

    Category apparel =
        new Category("APPAREL", null);

    Category beauty =
        new Category("BEAUTY", null);

    Category mobiles =
        new Category("MOBILES", electronics);

    Category laptops =
        new Category("LAPTOPS", electronics);

    Category accessories =
        new Category("ACCESSORIES", electronics);

    electronics.addChildren(mobiles);
    electronics.addChildren(laptops);
    electronics.addChildren(accessories);

    Category men =
        new Category("MEN", fashion);

    Category women =
        new Category("WOMEN", fashion);

    Category kids =
        new Category("KIDS", fashion);

    fashion.addChildren(men);
    fashion.addChildren(women);
    fashion.addChildren(kids);

    Category fruits =
        new Category("FRUITS", grocery);

    Category vegetables =
        new Category("VEGETABLES", grocery);

    Category snacks =
        new Category("SNACKS", grocery);

    grocery.addChildren(fruits);
    grocery.addChildren(vegetables);
    grocery.addChildren(snacks);

    categoryRepository.save(electronics);
    categoryRepository.save(fashion);
    categoryRepository.save(grocery);
    categoryRepository.save(books);
    categoryRepository.save(furniture);
    categoryRepository.save(kitchen);
    categoryRepository.save(apparel);
    categoryRepository.save(beauty);
  }
}