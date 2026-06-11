package ctu.student.regreen.controller;

import ctu.student.regreen.model.File;
import ctu.student.regreen.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileController {

    @Autowired
    FileService service;

    // [GET] /api/files
    @GetMapping
    public List<File> getAllFiles() {
        return service.getAllFiles();
    }

    // [GET] /api/files/{id}
    @GetMapping("/{id}")
    public File getFileById(@PathVariable Integer id) {
        return service.getFileById(id);
    }

    // [GET] /api/files?filename={filename}
    @GetMapping(params = "filename")
    public File getFileByFilename(@RequestParam String filename) {
        return service.getFileByFilename(filename);
    }

    // [GET] /api/files?updateMerchanism={updateMerchanism}
    @GetMapping(params = "updateMerchanism")
    public List<File> getFilesByUpdateMerchanism(@RequestParam Boolean updateMerchanism) {
        return service.getFilesByUpdateMerchanism(updateMerchanism);
    }

    // [GET] /api/files/count
    @GetMapping("/count")
    public Integer countFiles() {
        return service.countFiles();
    }

    // [POST] /api/files
    @PostMapping
    public File createFile(@RequestBody File file) {
        return service.createFile(file);
    }

    // [POST] /api/files/bulk
    @PostMapping("/bulk")
    public List<File> createFiles(@RequestBody List<File> files) {
        return service.createFiles(files);
    }

    // [PUT] /api/files/{id}
    @PutMapping("/{id}")
    public File updateFile(@PathVariable Integer id, @RequestBody File file) {
        return service.updateFile(id, file);
    }

    // [DELETE] /api/files/{id}
    @DeleteMapping("/{id}")
    public boolean deleteFile(@PathVariable Integer id) {
        return service.deleteFile(id);
    }

    // [DELETE] /api/files
    @DeleteMapping
    public void deleteAllFiles() {
        service.deleteAllFiles();
    }
}
