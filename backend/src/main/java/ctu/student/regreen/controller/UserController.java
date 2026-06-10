package ctu.student.regreen.controller;

import ctu.student.regreen.model.User;
import ctu.student.regreen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    UserService service;

    // [GET] /api/users
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // [GET] /api/users/{id}
    @GetMapping("{id}")
    public User getUserById(@PathVariable Integer id) {
        return service.getUserById(id);
    }

    // [POST] /api/users
    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }

    // [POST] /api/users/bulk
    @PostMapping("/bulk")
    public List<User> createUsers(@RequestBody List<User> users) {
        return service.createUsers(users);
    }

    // [PUT] /api/users/{id}
    @PutMapping("{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        return service.updateUser(id, user);
    }

    // [DELETE] /api/users/{id}
    @DeleteMapping("{id}")
    public boolean deleteUser(@PathVariable Integer id) {
        return service.deleteUser(id);
    }
}
