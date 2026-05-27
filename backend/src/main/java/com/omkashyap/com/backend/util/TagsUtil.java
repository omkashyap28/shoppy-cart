package com.omkashyap.com.backend.util;

import org.springframework.stereotype.Component;

@Component
public class TagsUtil {

  public String generateSlugByTagName(String tagName) {
    return tagName.toLowerCase()
        .trim()
        .replaceAll("[^a-z0-9\\s-]", "")
        .replaceAll("\\s+", "-");

  }

}
