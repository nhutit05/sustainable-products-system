package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.FileRequest;
import ctu.student.regreen.dto.response.FileResponse;

import java.util.List;

public interface FileService {

    FileResponse create(FileRequest request);
    List<FileResponse> getAllFiles();
    List<FileResponse> getAllFilesByMerchanism(Boolean updateMerchanism);
    FileResponse getFileById(Integer id);
    FileResponse updateFile(Integer id, FileRequest request);
    boolean deleteFile(Integer id);
    FileResponse getFileByFilename(String filename);

    Integer getCountFiles();
}
