package ctu.student.regreen.service;

import ctu.student.regreen.model.User;
import ctu.student.regreen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository repository;

    // [GET] /api/users
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // [GET] /api/users/{id}
    public User getUserById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [POST] /api/users
    public User createUser(User user) {
        return repository.save(user);
    }

    // [POST] /api/users/bulk
    public List<User> createUsers(List<User> users) {
        return repository.saveAll(users);
    }

    // [PUT] /api/users/{id}
    public User updateUser(Integer id, User user) {
        User existingUser = repository.findById(id).orElse(null);
        if (existingUser != null) {
            return repository.save(existingUser);
        }
        return null;
    }

    // [DELETE] /api/users/{id}
    public boolean deleteUser(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/users
    public void deleteAllUsers() {
        repository.deleteAll();
    }
}
