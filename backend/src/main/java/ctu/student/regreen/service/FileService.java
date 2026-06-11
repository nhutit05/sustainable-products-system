package ctu.student.regreen.service;

import ctu.student.regreen.model.File;
import ctu.student.regreen.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    @Autowired
    FileRepository repository;

    // [GET] /api/files
    public List<File> getAllFiles() {
        return repository.findAll();
    }

    // [GET] /api/files/{id}
    public File getFileById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [GET] /api/files?filename={filename}
    public File getFileByFilename(String filename) {
        return repository.findByFileName(filename).orElse(null);
    }

    // [GET] /api/files?updateMerchanism={updateMerchanism}
    public List<File> getFilesByUpdateMerchanism(Boolean updateMerchanism) {
        return repository.findByUpdateMerchanism(updateMerchanism);
    }

    // [GET] /api/files/count
    public Integer countFiles() {
        return (int) repository.count();
    }

    // [POST] /api/files
    public File createFile(File file) {
        return repository.save(file);
    }

    // [POST] /api/files/bulk
    public List<File> createFiles(List<File> files) {
        return repository.saveAll(files);
    }

    // [PUT] /api/files/{id}
    public File updateFile(Integer id, File file) {
        File existingFile = repository.findById(id).orElse(null);
        if (existingFile != null) {
            return repository.save(file);
        }
        return null;
    }

    // [DELETE] /api/files/{id}
    public boolean deleteFile(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/files
    public void deleteAllFiles() {
        repository.deleteAll();
    }
}
