package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.FileRequest;
import ctu.student.regreen.dto.response.FileResponse;
import ctu.student.regreen.model.File;
import org.springframework.stereotype.Component;

@Component
public class FileMapper {

    public FileResponse toResponse(File file) {
       return new FileResponse(
               file.getFileId(),
               file.getFileTitle(),
               file.getFileName(),
               file.getFileUrl(),
               file.getFileFormat(),
               file.getUpdateMerchanism()
       );
    }

    public void update(File fileFound, FileRequest request) {
        fileFound.setFileTitle(request.getFileTitle());
        fileFound.setFileName(request.getFileName());
        fileFound.setFileUrl(request.getFileUrl());
        fileFound.setFileFormat(request.getFileFormat());
        fileFound.setUpdateMerchanism(request.getUpdateMerchanism());
    }

    public File toEntity(FileRequest request) {
        File file = new File();
        file.setFileTitle(request.getFileTitle());
        file.setFileName(request.getFileName());
        file.setFileUrl(request.getFileUrl());
        file.setFileFormat(request.getFileFormat());
        file.setUpdateMerchanism(request.getUpdateMerchanism());
        return file;
    }
}
