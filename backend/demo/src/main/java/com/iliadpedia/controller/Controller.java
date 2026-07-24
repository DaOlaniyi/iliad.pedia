@RestController
@RequestMapping("/api")
public class ArticleController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    // Example that will later call PHP
    @PostMapping("/articles")
    public ResponseEntity<?> submitArticle(@RequestBody ArticleRequest req) {
        // TODO: call your PHP script here
        return ResponseEntity.ok(Map.of("message", "received " + req.title()));
    }
}


// // Use RestClient (Spring 6.1+) or WebClient / HttpClient
// RestClient client = RestClient.create();
// String result = client.post()
//     .uri("http://localhost:8000/your-script.php")
//     .body(Map.of("title", title, "bio", bio))
//     .retrieve()
//     .body(String.class);