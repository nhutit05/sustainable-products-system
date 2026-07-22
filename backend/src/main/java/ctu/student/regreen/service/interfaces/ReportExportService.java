package ctu.student.regreen.service.interfaces;

public interface ReportExportService {

    byte[] exportExcel(String reportType, String startDate, String endDate);

    byte[] exportPdf(String reportType, String startDate, String endDate);
}
