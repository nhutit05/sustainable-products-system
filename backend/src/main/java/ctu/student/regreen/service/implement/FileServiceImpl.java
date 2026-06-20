package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.FileRequest;
import ctu.student.regreen.dto.response.FileResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.FileMapper;
import ctu.student.regreen.model.File;
import ctu.student.regreen.repository.FileRepository;
import ctu.student.regreen.service.interfaces.FileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository repository;

    public List<FileResponse> getAllFiles() {
        return repository.findAll()
                .stream()
                .map(FileMapper::toResponse)
                .toList();
    }

    public FileResponse create(FileRequest request) {
        File file = FileMapper.toEntity(request);
        return FileMapper.toResponse(repository.save(file));
    }

    public List<FileResponse> getAllFilesByMerchanism(Boolean updateMerchanism) {
        return repository.findByUpdateMerchanism(updateMerchanism)
                .stream()
                .map(FileMapper::toResponse)
                .toList();
    }

    public FileResponse getFileById(Integer id) {
        File file = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FILE_NOT_FOUND));
        return FileMapper.toResponse(file);
    }

    public FileResponse getFileByFilename(String filename) {
        File file = repository.findByFileName(filename).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FILE_NOT_FOUND));
        return FileMapper.toResponse(file);
    }

    public Integer getCountFiles() {
        return (Integer) repository.findAll().size();
    }

    public FileResponse updateFile(Integer id, FileRequest request) {
        File file = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FILE_NOT_FOUND));
        FileMapper.update(file, request);
        return FileMapper.toResponse(file);
    }

    public boolean deleteFile(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(ErrorCode.FILE_NOT_FOUND);
        }
        repository.deleteById(id);
        return true;
    }

}
