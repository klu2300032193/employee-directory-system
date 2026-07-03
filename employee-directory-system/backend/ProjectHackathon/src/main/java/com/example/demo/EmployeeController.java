package com.example.demo;

import java.util.Collection;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "*")
@RestController
public class EmployeeController {

    private EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/employees")
    public ResponseEntity<String> addEmployee(@RequestBody Employee employee) {
        boolean added = employeeService.addEmployee(employee);

        if (added) {
            return new ResponseEntity<>("Employee added successfully.", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("Employee ID already exists.", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable int id) {
        Employee employee = employeeService.getEmployee(id);

        if (employee == null) {
            return new ResponseEntity<>("Employee not found.", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @GetMapping("/employees")
    public Collection<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable int id, @RequestBody Employee employee) {
        boolean updated = employeeService.updateEmployee(id, employee);

        if (updated) {
            return new ResponseEntity<>("Employee updated successfully.", HttpStatus.OK);
        }

        return new ResponseEntity<>("Employee not found.", HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        boolean deleted = employeeService.deleteEmployee(id);

        if (deleted) {
            return new ResponseEntity<>("Employee deleted successfully.", HttpStatus.OK);
        }

        return new ResponseEntity<>("Employee not found.", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/employees/{id}/exists")
    public boolean employeeExists(@PathVariable int id) {
        return employeeService.employeeExists(id);
    }

    @GetMapping("/employees/count")
    public long countEmployees() {
        return employeeService.countEmployees();
    }
}