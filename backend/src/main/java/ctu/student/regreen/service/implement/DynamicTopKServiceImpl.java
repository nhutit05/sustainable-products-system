package ctu.student.regreen.service.implement;

import org.springframework.stereotype.Service;

import ctu.student.regreen.service.interfaces.DynamicTopKService;

@Service
public class DynamicTopKServiceImpl implements DynamicTopKService {

    @Override
    public int calculate(String question) {

        if (question == null || question.isBlank()) {
            return 3;
        }

        int words = question.trim().split("\\s+").length;

        // FAQ
        if (words <= 5) {
            return 3;
        }

        // mô tả trung bình
        if (words <= 15) {
            return 5;
        }

        // câu dài
        return 8;
    }
}