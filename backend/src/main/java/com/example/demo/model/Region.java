package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private double temperature;
    private double aqi;
    private double populationDensity;
    private double income;
    private double emissions;

    private double vulnerabilityScore;
    private double gapScore;
}