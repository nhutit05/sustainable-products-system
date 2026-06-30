package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.ChatMessageMemory;

public interface QueryRewriteService {

    String rewrite(
            String question,
            List<ChatMessageMemory> history
    );

}