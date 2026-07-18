package ctu.student.regreen.service.interfaces;

public interface ReportExportService {

    byte[] exportExcel(String reportType);

    byte[] exportPdf(String reportType);
}
