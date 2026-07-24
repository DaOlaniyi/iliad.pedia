package com.iliadpedia.demo.controller;
import org.springframework.web.client.RestClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ArticleController {    

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "Active");
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitArticle(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String bio = body.get("bio");

        RestClient client = RestClient.create();
        String result = client.post()
        .uri("https://api.doidity.com/create.php")
        .body(Map.of("title", title, "biography", bio))
        .retrieve()
        .body(String.class);

    //    return ResponseEntity.ok(Map.of("message", "\"" + result + "\"" + " : title =" + title +", bio=" + bio));
        return ResponseEntity.ok(Map.of("message", "PHP Result -> \"" + result + "\"" ));
    }

    @GetMapping("/getarticles")
    public ResponseEntity<?>  getArticles() {
        RestClient client = RestClient.create();
        String result = client.get()
        .uri("https://api.doidity.com/getArticles.php")
        .retrieve()
        .body(String.class);
        return ResponseEntity.ok(Map.of("articles", result));

    }
}

// Use RestClient (Spring 6.1+) or WebClient / HttpClient
