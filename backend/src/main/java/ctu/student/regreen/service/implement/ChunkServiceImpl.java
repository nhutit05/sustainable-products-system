package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.service.interfaces.ChunkService;

@Service
public class ChunkServiceImpl
        implements ChunkService {

    /**
     * Mỗi chunk tối đa 1000 ký tự.
     */
    private static final int CHUNK_SIZE = 1000;

    /**
     * Chồng lấn 150 ký tự.
     */
    private static final int OVERLAP = 150;

    @Override
    public List<String> splitIntoChunks(
            String text
    ) {

        List<String> chunks =
                new ArrayList<>();

        if (text == null || text.isBlank()) {
            return chunks;
        }

        int start = 0;

        while (start < text.length()) {

            int end =
                    Math.min(
                            start + CHUNK_SIZE,
                            text.length()
                    );

            chunks.add(
                    text.substring(start, end)
            );

            if (end == text.length()) {
                break;
            }

            start =
                    end - OVERLAP;

        }

        return chunks;

    }

}