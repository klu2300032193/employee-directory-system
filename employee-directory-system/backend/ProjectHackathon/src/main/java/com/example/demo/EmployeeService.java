package com.example.demo;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public boolean addEmployee(Employee employee) {
        if (employeeRepository.existsById(employee.getId())) {
            return false;
        }

        employeeRepository.save(employee);
        return true;
    }

    public Employee getEmployee(int id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public boolean updateEmployee(int id, Employee employee) {
        if (!employeeRepository.existsById(id)) {
            return false;
        }

        employee.setId(id);
        employeeRepository.save(employee);
        return true;
    }

    public boolean deleteEmployee(int id) {
        if (!employeeRepository.existsById(id)) {
            return false;
        }

        employeeRepository.deleteById(id);
        return true;
    }

    public boolean employeeExists(int id) {
        return employeeRepository.existsById(id);
    }

    public long countEmployees() {
        return employeeRepository.count();
    }
}