package com.example.demo;

import com.example.demo.model.Region;
import com.example.demo.repository.RegionRepository;
import com.example.demo.service.RegionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedRegions(RegionRepository regionRepository, RegionService regionService) {
		return args -> {
			if (regionRepository.count() == 0) {
				Region delhi = new Region();
				delhi.setCity("Delhi");
				delhi.setAqi(90);
				delhi.setTemperature(32);
				delhi.setIncome(42000);
				delhi.setPopulationDensity(3200);
				delhi.setEmissions(520);
				delhi.setLatitude(28.7041);
				delhi.setLongitude(77.1025);
				delhi.setVulnerabilityScore(regionService.calculateVulnerability(delhi));
				delhi.setGapScore(regionService.calculateGap(delhi));

				Region mumbai = new Region();
				mumbai.setCity("Mumbai");
				mumbai.setAqi(78);
				mumbai.setTemperature(30);
				mumbai.setIncome(48000);
				mumbai.setPopulationDensity(2800);
				mumbai.setEmissions(460);
				mumbai.setLatitude(19.0760);
				mumbai.setLongitude(72.8777);
				mumbai.setVulnerabilityScore(regionService.calculateVulnerability(mumbai));
				mumbai.setGapScore(regionService.calculateGap(mumbai));

				Region bangalore = new Region();
				bangalore.setCity("Bangalore");
				bangalore.setAqi(72);
				bangalore.setTemperature(28);
				bangalore.setIncome(52000);
				bangalore.setPopulationDensity(2500);
				bangalore.setEmissions(420);
				bangalore.setLatitude(12.9716);
				bangalore.setLongitude(77.5946);
				bangalore.setVulnerabilityScore(regionService.calculateVulnerability(bangalore));
				bangalore.setGapScore(regionService.calculateGap(bangalore));

				Region kolkata = new Region();
				kolkata.setCity("Kolkata");
				kolkata.setAqi(85);
				kolkata.setTemperature(31);
				kolkata.setIncome(39000);
				kolkata.setPopulationDensity(3000);
				kolkata.setEmissions(500);
				kolkata.setLatitude(22.5726);
				kolkata.setLongitude(88.3639);
				kolkata.setVulnerabilityScore(regionService.calculateVulnerability(kolkata));
				kolkata.setGapScore(regionService.calculateGap(kolkata));

				Region chennai = new Region();
				chennai.setCity("Chennai");
				chennai.setAqi(74);
				chennai.setTemperature(29);
				chennai.setIncome(46000);
				chennai.setPopulationDensity(2700);
				chennai.setEmissions(440);
				chennai.setLatitude(13.0827);
				chennai.setLongitude(80.2707);
				chennai.setVulnerabilityScore(regionService.calculateVulnerability(chennai));
				chennai.setGapScore(regionService.calculateGap(chennai));

				Region hyderabad = new Region();
				hyderabad.setCity("Hyderabad");
				hyderabad.setAqi(68);
				hyderabad.setTemperature(27);
				hyderabad.setIncome(45000);
				hyderabad.setPopulationDensity(2400);
				hyderabad.setEmissions(400);
				hyderabad.setLatitude(17.3850);
				hyderabad.setLongitude(78.4867);
				hyderabad.setVulnerabilityScore(regionService.calculateVulnerability(hyderabad));
				hyderabad.setGapScore(regionService.calculateGap(hyderabad));

				Region pune = new Region();
				pune.setCity("Pune");
				pune.setAqi(65);
				pune.setTemperature(26);
				pune.setIncome(50000);
				pune.setPopulationDensity(2200);
				pune.setEmissions(380);
				pune.setLatitude(18.5204);
				pune.setLongitude(73.8567);
				pune.setVulnerabilityScore(regionService.calculateVulnerability(pune));
				pune.setGapScore(regionService.calculateGap(pune));

				Region ahmedabad = new Region();
				ahmedabad.setCity("Ahmedabad");
				ahmedabad.setAqi(80);
				ahmedabad.setTemperature(31);
				ahmedabad.setIncome(41000);
				ahmedabad.setPopulationDensity(2600);
				ahmedabad.setEmissions(450);
				ahmedabad.setLatitude(23.0225);
				ahmedabad.setLongitude(72.5714);
				ahmedabad.setVulnerabilityScore(regionService.calculateVulnerability(ahmedabad));
				ahmedabad.setGapScore(regionService.calculateGap(ahmedabad));

				Region jaipur = new Region();
				jaipur.setCity("Jaipur");
				jaipur.setAqi(75);
				jaipur.setTemperature(33);
				jaipur.setIncome(38000);
				jaipur.setPopulationDensity(2000);
				jaipur.setEmissions(420);
				jaipur.setLatitude(26.9124);
				jaipur.setLongitude(75.7873);
				jaipur.setVulnerabilityScore(regionService.calculateVulnerability(jaipur));
				jaipur.setGapScore(regionService.calculateGap(jaipur));

				regionRepository.save(delhi);
				regionRepository.save(mumbai);
				regionRepository.save(bangalore);
				regionRepository.save(kolkata);
				regionRepository.save(chennai);
				regionRepository.save(hyderabad);
				regionRepository.save(pune);
				regionRepository.save(ahmedabad);
				regionRepository.save(jaipur);
			}
		};
	}

}