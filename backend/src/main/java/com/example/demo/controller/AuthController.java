package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            // Check if user already exists
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(null, null, null, null, "User already exists"));
            }
            
            // Create new user
            User user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getRole()
            );
            
            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok(new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getRole(),
                "User registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthResponse(null, null, null, null, "Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Optional<User> user = userRepository.findByEmailAndPassword(
                request.getEmail(),
                request.getPassword()
            );
            
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, null, null, "Invalid email or password"));
            }
            
            User loggedInUser = user.get();
            return ResponseEntity.ok(new AuthResponse(
                loggedInUser.getId(),
                loggedInUser.getEmail(),
                loggedInUser.getName(),
                loggedInUser.getRole(),
                "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(null, null, null, null, "Login failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new AuthResponse(null, null, null, null, "User not found"));
        }
        
        User foundUser = user.get();
        return ResponseEntity.ok(new AuthResponse(
            foundUser.getId(),
            foundUser.getEmail(),
            foundUser.getName(),
            foundUser.getRole(),
            "User found"
        ));
    }
}
