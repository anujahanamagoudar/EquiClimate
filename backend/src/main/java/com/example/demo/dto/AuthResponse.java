package com.example.demo.dto;

public class AuthResponse {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String message;
    private String token;
    
    public AuthResponse() {}
    
    public AuthResponse(Long id, String email, String name, String role, String message) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.message = message;
        this.token = "mock_token_" + id;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}
