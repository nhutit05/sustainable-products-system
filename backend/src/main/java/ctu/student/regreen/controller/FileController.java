package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.FileRequest;
import ctu.student.regreen.dto.response.FileResponse;
import ctu.student.regreen.service.interfaces.FileService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/files")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
public class FileController {

   private final FileService service;

    // [GET] /api/files
    @GetMapping
    public List<FileResponse> getAllFiles() {
        return service.getAllFiles();
    }

    // [GET] /api/files/{id}
    @GetMapping("/{id}")
    public FileResponse getFileById(@PathVariable Integer id) {
        return service.getFileById(id);
    }

    // [GET] /api/files?filename={filename}
    @GetMapping(params = "filename")
    public FileResponse getFileByFilename(@RequestParam String filename) {
        return service.getFileByFilename(filename);
    }

    // [GET] /api/files?updateMerchanism={updateMerchanism}
    @GetMapping(params = "updateMerchanism")
    public List<FileResponse> getFilesByUpdateMerchanism(@RequestParam Boolean updateMerchanism) {
        return service.getAllFilesByMerchanism(updateMerchanism);
    }

    // [GET] /api/files/count
    @GetMapping("/count")
    public Integer countFiles() {
        return service.getCountFiles();
    }

    // [POST] /api/files
    @PostMapping
    public FileResponse createFile(@RequestBody FileRequest file) {
        return service.create(file);
    }


    // [PUT] /api/files/{id}
    @PutMapping("/{id}")
    public FileResponse updateFile(@PathVariable Integer id, @RequestBody FileRequest file) {
        System.out.println(file);
        return service.updateFile(id, file);
    }

    // [DELETE] /api/files/{id}
    @DeleteMapping("/{id}")
    public boolean deleteFile(@PathVariable Integer id) {
        return service.deleteFile(id);
    }

}
