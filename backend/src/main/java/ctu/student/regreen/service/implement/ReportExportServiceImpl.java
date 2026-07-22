package ctu.student.regreen.service.implement;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.InventoryDetailResponse;
import ctu.student.regreen.dto.response.InventoryOverviewResponse;
import ctu.student.regreen.dto.response.NewCustomerStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.RevenueByPeriodResponse;
import ctu.student.regreen.dto.response.ReviewStatsResponse;
import ctu.student.regreen.dto.response.TopCustomerResponse;
import ctu.student.regreen.dto.response.TopProductResponse;
import ctu.student.regreen.dto.response.VoucherStatsResponse;
import ctu.student.regreen.service.interfaces.ReportExportService;
import ctu.student.regreen.service.interfaces.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportExportServiceImpl implements ReportExportService {

    private final StatisticsService statisticsService;

    private static final String[] REVENUE_HEADERS = {"STT", "Danh muc", "Doanh thu (VND)", "So don", "Ty le (%)"};
    private static final String[] REVENUE_PERIOD_HEADERS = {"Thoi gian", "Doanh thu (VND)", "So don"};
    private static final String[] TOP_PRODUCT_HEADERS = {"STT", "San pham", "Danh muc", "So luong ban", "Doanh thu (VND)"};
    private static final String[] ORDER_STATUS_HEADERS = {"Trang thai", "So luong", "Ty le (%)"};
    private static final String[] REVIEW_HEADERS = {"Rating", "So luong"};
    private static final String[] REFUND_HEADERS = {"Trang thai", "So luong"};
    private static final String[] VOUCHER_HEADERS = {"Ma voucher", "Giam gia (VND)", "Luot su dung", "Tong giam (VND)", "Trang thai"};
    private static final String[] CARBON_HEADERS = {"Muc carbon", "So san pham"};
    private static final String[] TOP_CUSTOMER_HEADERS = {"STT", "Khach hang", "So don", "Tong chi tieu (VND)", "TB/don (VND)"};
    private static final String[] INVENTORY_HEADERS = {"STT", "San pham", "Danh muc", "Ton kho", "Gia (VND)"};
    private static final String[] NEW_CUSTOMER_HEADERS = {"Thang", "So KH moi"};

    private static final String REPORT_TITLE = "ReGreen - Bao cao thong ke";
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public byte[] exportExcel(String reportType, String startDate, String endDate) {
        try (Workbook workbook = new XSSFWorkbook()) {
            switch (reportType) {
                case "revenue-by-category" -> writeRevenueByCategorySheet(workbook, startDate, endDate);
                case "revenue-by-period" -> writeRevenueByPeriodSheet(workbook, startDate, endDate);
                case "top-products" -> writeTopProductsSheet(workbook, startDate, endDate);
                case "order-status" -> writeOrderStatusSheet(workbook, startDate, endDate);
                case "reviews" -> writeReviewSheet(workbook);
                case "refunds" -> writeRefundSheet(workbook, startDate, endDate);
                case "vouchers" -> writeVoucherSheet(workbook, startDate, endDate);
                case "carbon" -> writeCarbonSheet(workbook);
                case "top-customers" -> writeTopCustomerSheet(workbook, startDate, endDate);
                case "inventory-overview" -> writeInventorySheet(workbook);
                case "new-customers" -> writeNewCustomerSheet(workbook, startDate, endDate);
                default -> writeAllExcel(workbook, startDate, endDate);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Loi xuat Excel", e);
        }
    }

    @Override
    public byte[] exportPdf(String reportType, String startDate, String endDate) {
        try (PDDocument document = new PDDocument()) {
            PDFont font = loadFont(document);

            switch (reportType) {
                case "revenue-by-category" -> writeRevenueByCategoryPdf(document, font, startDate, endDate);
                case "revenue-by-period" -> writeRevenueByPeriodPdf(document, font, startDate, endDate);
                case "top-products" -> writeTopProductsPdf(document, font, startDate, endDate);
                case "order-status" -> writeOrderStatusPdf(document, font, startDate, endDate);
                case "reviews" -> writeReviewPdf(document, font);
                case "refunds" -> writeRefundPdf(document, font, startDate, endDate);
                case "vouchers" -> writeVoucherPdf(document, font, startDate, endDate);
                case "carbon" -> writeCarbonPdf(document, font);
                case "top-customers" -> writeTopCustomerPdf(document, font, startDate, endDate);
                case "inventory-overview" -> writeInventoryPdf(document, font);
                case "new-customers" -> writeNewCustomerPdf(document, font, startDate, endDate);
                default -> writeAllPdf(document, font, startDate, endDate);
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Loi xuat PDF", e);
        }
    }

    private PDFont loadFont(PDDocument document) throws IOException {
        try {
            return PDType0Font.load(document, new java.io.File("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"));
        } catch (IOException e) {
            log.warn("Khong tim thay DejaVu Sans font, su dung Helvetica (khong ho tro dau Tieng Viet)");
            return new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }

    private void writeHeaderRow(Sheet sheet, String[] headers, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            var cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    private void autoSizeColumns(Sheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    // ==================== EXCEL: Revenue By Category ====================
    private void writeRevenueByCategorySheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Doanh thu theo danh muc");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, REVENUE_HEADERS, headerStyle);
        List<RevenueByCategoryResponse> data = statisticsService.getRevenueByCategory(startDate, endDate);

        int rowNum = 1;
        for (int i = 0; i < data.size(); i++) {
            RevenueByCategoryResponse r = data.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(r.getCategoryName());
            var revenueCell = row.createCell(2);
            revenueCell.setCellValue(r.getRevenue());
            revenueCell.setCellStyle(currencyStyle);
            row.createCell(3).setCellValue(r.getOrderCount());
            var pctCell = row.createCell(4);
            pctCell.setCellValue(r.getPercentage() != null ? r.getPercentage() : 0.0);
            pctCell.setCellStyle(createDataStyle(workbook));
        }
        autoSizeColumns(sheet, REVENUE_HEADERS.length);
    }

    // ==================== EXCEL: Revenue By Period ====================
    private void writeRevenueByPeriodSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Doanh thu theo thoi gian");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, REVENUE_PERIOD_HEADERS, headerStyle);
        List<RevenueByPeriodResponse> data = statisticsService.getRevenueByPeriod(startDate, endDate, "day");

        int rowNum = 1;
        for (RevenueByPeriodResponse r : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(r.getPeriod());
            var revenueCell = row.createCell(1);
            revenueCell.setCellValue(r.getRevenue());
            revenueCell.setCellStyle(currencyStyle);
            row.createCell(2).setCellValue(r.getOrderCount());
        }
        autoSizeColumns(sheet, REVENUE_PERIOD_HEADERS.length);
    }

    // ==================== EXCEL: Top Products ====================
    private void writeTopProductsSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("San pham ban chay");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, TOP_PRODUCT_HEADERS, headerStyle);
        List<TopProductResponse> data = statisticsService.getTopProducts(50, startDate, endDate);

        int rowNum = 1;
        for (int i = 0; i < data.size(); i++) {
            TopProductResponse p = data.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(p.getProductName());
            row.createCell(2).setCellValue(p.getCategoryName());
            row.createCell(3).setCellValue(p.getTotalQuantity());
            var revenueCell = row.createCell(4);
            revenueCell.setCellValue(p.getTotalRevenue());
            revenueCell.setCellStyle(currencyStyle);
        }
        autoSizeColumns(sheet, TOP_PRODUCT_HEADERS.length);
    }

    // ==================== EXCEL: Order Status ====================
    private void writeOrderStatusSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Trang thai don hang");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        writeHeaderRow(sheet, ORDER_STATUS_HEADERS, headerStyle);
        List<OrderStatusDistributionResponse> data = statisticsService.getOrderStatusDistribution(startDate, endDate);

        int rowNum = 1;
        for (OrderStatusDistributionResponse r : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(r.getStatusName());
            row.createCell(1).setCellValue(r.getCount());
            var pctCell = row.createCell(2);
            pctCell.setCellValue(r.getPercentage() != null ? r.getPercentage() : 0.0);
            pctCell.setCellStyle(dataStyle);
        }
        autoSizeColumns(sheet, ORDER_STATUS_HEADERS.length);
    }

    // ==================== EXCEL: Reviews ====================
    private void writeReviewSheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Danh gia");
        CellStyle headerStyle = createHeaderStyle(workbook);

        writeHeaderRow(sheet, REVIEW_HEADERS, headerStyle);
        ReviewStatsResponse stats = statisticsService.getReviewStats();

        Row row1 = sheet.createRow(1);
        row1.createCell(0).setCellValue("1 sao");
        row1.createCell(1).setCellValue(stats.getRating1Count());
        Row row2 = sheet.createRow(2);
        row2.createCell(0).setCellValue("2 sao");
        row2.createCell(1).setCellValue(stats.getRating2Count());
        Row row3 = sheet.createRow(3);
        row3.createCell(0).setCellValue("3 sao");
        row3.createCell(1).setCellValue(stats.getRating3Count());
        Row row4 = sheet.createRow(4);
        row4.createCell(0).setCellValue("4 sao");
        row4.createCell(1).setCellValue(stats.getRating4Count());
        Row row5 = sheet.createRow(5);
        row5.createCell(0).setCellValue("5 sao");
        row5.createCell(1).setCellValue(stats.getRating5Count());

        autoSizeColumns(sheet, REVIEW_HEADERS.length);
    }

    // ==================== EXCEL: Refunds ====================
    private void writeRefundSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Hoan tien");
        CellStyle headerStyle = createHeaderStyle(workbook);

        writeHeaderRow(sheet, REFUND_HEADERS, headerStyle);
        RefundStatsResponse stats = statisticsService.getRefundStats(startDate, endDate);

        Row r1 = sheet.createRow(1);
        r1.createCell(0).setCellValue("PENDING");
        r1.createCell(1).setCellValue(stats.getPendingCount());
        Row r2 = sheet.createRow(2);
        r2.createCell(0).setCellValue("APPROVED");
        r2.createCell(1).setCellValue(stats.getApprovedCount());
        Row r3 = sheet.createRow(3);
        r3.createCell(0).setCellValue("REJECTED");
        r3.createCell(1).setCellValue(stats.getRejectedCount());
        Row r4 = sheet.createRow(4);
        r4.createCell(0).setCellValue("REFUNDED");
        r4.createCell(1).setCellValue(stats.getRefundedCount());

        autoSizeColumns(sheet, REFUND_HEADERS.length);
    }

    // ==================== EXCEL: Vouchers ====================
    private void writeVoucherSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Voucher");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, VOUCHER_HEADERS, headerStyle);
        List<VoucherStatsResponse> data = statisticsService.getVoucherStats(startDate, endDate);

        int rowNum = 1;
        for (VoucherStatsResponse v : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(v.getCode());
            var discountCell = row.createCell(1);
            discountCell.setCellValue(v.getDiscountValue());
            discountCell.setCellStyle(currencyStyle);
            row.createCell(2).setCellValue(v.getUsageCount());
            var totalCell = row.createCell(3);
            totalCell.setCellValue(v.getTotalDiscountGiven());
            totalCell.setCellStyle(currencyStyle);
            row.createCell(4).setCellValue(Boolean.TRUE.equals(v.getIsActive()) ? "Hoat dong" : "Khong hoat dong");
        }
        autoSizeColumns(sheet, VOUCHER_HEADERS.length);
    }

    // ==================== EXCEL: Carbon ====================
    private void writeCarbonSheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Chi so carbon");
        CellStyle headerStyle = createHeaderStyle(workbook);

        writeHeaderRow(sheet, CARBON_HEADERS, headerStyle);
        CarbonIndexStatsResponse stats = statisticsService.getCarbonIndexStats();

        Row r1 = sheet.createRow(1);
        r1.createCell(0).setCellValue("Thap (<5.0)");
        r1.createCell(1).setCellValue(stats.getLowCarbonCount());
        Row r2 = sheet.createRow(2);
        r2.createCell(0).setCellValue("Trung binh (5.0-15.0)");
        r2.createCell(1).setCellValue(stats.getMediumCarbonCount());
        Row r3 = sheet.createRow(3);
        r3.createCell(0).setCellValue("Cao (>=15.0)");
        r3.createCell(1).setCellValue(stats.getHighCarbonCount());

        autoSizeColumns(sheet, CARBON_HEADERS.length);
    }

    // ==================== EXCEL: Top Customers ====================
    private void writeTopCustomerSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Khach hang");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, TOP_CUSTOMER_HEADERS, headerStyle);
        List<TopCustomerResponse> data = statisticsService.getTopCustomers(50, startDate, endDate);

        int rowNum = 1;
        for (int i = 0; i < data.size(); i++) {
            TopCustomerResponse c = data.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(c.getUsername());
            row.createCell(2).setCellValue(c.getTotalOrders());
            var spentCell = row.createCell(3);
            spentCell.setCellValue(c.getTotalSpent());
            spentCell.setCellStyle(currencyStyle);
            var avgCell = row.createCell(4);
            avgCell.setCellValue(c.getAverageOrderValue());
            avgCell.setCellStyle(currencyStyle);
        }
        autoSizeColumns(sheet, TOP_CUSTOMER_HEADERS.length);
    }

    // ==================== EXCEL: Inventory ====================
    private void writeInventorySheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Hang ton kho");
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        writeHeaderRow(sheet, INVENTORY_HEADERS, headerStyle);
        InventoryOverviewResponse overview = statisticsService.getInventoryOverview();
        List<InventoryDetailResponse> data = overview.getDetails();

        int rowNum = 1;
        for (int i = 0; i < data.size(); i++) {
            InventoryDetailResponse d = data.get(i);
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(i + 1);
            row.createCell(1).setCellValue(d.getProductName());
            row.createCell(2).setCellValue(d.getCategoryName());
            row.createCell(3).setCellValue(d.getInventory());
            var priceCell = row.createCell(4);
            priceCell.setCellValue(d.getPrice() != null ? d.getPrice() : 0.0);
            priceCell.setCellStyle(currencyStyle);
        }
        autoSizeColumns(sheet, INVENTORY_HEADERS.length);
    }

    // ==================== EXCEL: New Customers ====================
    private void writeNewCustomerSheet(Workbook workbook, String startDate, String endDate) {
        Sheet sheet = workbook.createSheet("Khach hang moi");
        CellStyle headerStyle = createHeaderStyle(workbook);

        writeHeaderRow(sheet, NEW_CUSTOMER_HEADERS, headerStyle);
        List<NewCustomerStatsResponse> data = statisticsService.getNewCustomerStats(startDate, endDate);

        int rowNum = 1;
        for (NewCustomerStatsResponse s : data) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(s.getPeriod());
            row.createCell(1).setCellValue(s.getCount());
        }
        autoSizeColumns(sheet, NEW_CUSTOMER_HEADERS.length);
    }

    // ==================== EXCEL: All ====================
    private void writeAllExcel(Workbook workbook, String startDate, String endDate) {
        writeRevenueByCategorySheet(workbook, startDate, endDate);
        writeRevenueByPeriodSheet(workbook, startDate, endDate);
        writeTopProductsSheet(workbook, startDate, endDate);
        writeOrderStatusSheet(workbook, startDate, endDate);
        writeReviewSheet(workbook);
        writeRefundSheet(workbook, startDate, endDate);
        writeVoucherSheet(workbook, startDate, endDate);
        writeCarbonSheet(workbook);
        writeTopCustomerSheet(workbook, startDate, endDate);
        writeInventorySheet(workbook);
        writeNewCustomerSheet(workbook, startDate, endDate);
    }

    // ==================== PDF HELPERS ====================
    private void writePdfTitle(PDPageContentStream cs, PDFont font, String title) throws IOException {
        cs.beginText();
        cs.setFont(font, 18);
        cs.newLineAtOffset(50, PDRectangle.A4.getHeight() - 50);
        cs.showText(title);
        cs.endText();

        cs.beginText();
        cs.setFont(font, 10);
        cs.newLineAtOffset(50, PDRectangle.A4.getHeight() - 70);
        cs.showText("Ngay xuat: " + LocalDate.now().format(DATE_FMT));
        cs.endText();
    }

    private float writePdfTableHeader(PDPageContentStream cs, PDFont font, float y, String[] headers, float[] widths) throws IOException {
        float x = 50;
        cs.setNonStrokingColor(66f / 255, 133f / 255, 244f / 255);
        cs.addRect(x, y - 2, getWidthSum(widths), 16);
        cs.fill();
        cs.setNonStrokingColor(0f, 0f, 0f);

        cs.beginText();
        cs.setFont(font, 9);
        for (int i = 0; i < headers.length; i++) {
            cs.newLineAtOffset(x + 2, y);
            cs.showText(headers[i]);
            x += widths[i];
        }
        cs.endText();
        return y - 20;
    }

    private float writePdfTableRow(PDPageContentStream cs, PDFont font, float y, String[] values, float[] widths) throws IOException {
        float x = 50;
        cs.beginText();
        cs.setFont(font, 9);
        for (int i = 0; i < values.length; i++) {
            cs.newLineAtOffset(x + 2, y);
            cs.showText(values[i] != null ? values[i] : "");
            x += widths[i];
        }
        cs.endText();
        return y - 18;
    }

    private float getWidthSum(float[] widths) {
        float sum = 0;
        for (float w : widths) sum += w;
        return sum;
    }

    private void writePdfFooter(PDPageContentStream cs, PDFont font, int pageNum) throws IOException {
        cs.beginText();
        cs.setFont(font, 8);
        cs.newLineAtOffset(PDRectangle.A4.getWidth() / 2 - 20, 20);
        cs.showText("Trang " + pageNum);
        cs.endText();
    }

    // ==================== PDF: Revenue By Category ====================
    private void writeRevenueByCategoryPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao doanh thu theo danh muc");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {30, 160, 120, 80, 80};
        y = writePdfTableHeader(cs, font, y, REVENUE_HEADERS, widths);

        List<RevenueByCategoryResponse> data = statisticsService.getRevenueByCategory(startDate, endDate);
        for (int i = 0; i < data.size(); i++) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, REVENUE_HEADERS, widths);
            }
            RevenueByCategoryResponse r = data.get(i);
            y = writePdfTableRow(cs, font, y, new String[]{
                    String.valueOf(i + 1),
                    r.getCategoryName(),
                    String.valueOf(r.getRevenue()),
                    String.valueOf(r.getOrderCount()),
                    r.getPercentage() != null ? String.format("%.1f%%", r.getPercentage()) : "0%"
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Revenue By Period ====================
    private void writeRevenueByPeriodPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao doanh thu theo thoi gian");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {160, 160, 100};
        y = writePdfTableHeader(cs, font, y, REVENUE_PERIOD_HEADERS, widths);

        List<RevenueByPeriodResponse> data = statisticsService.getRevenueByPeriod(startDate, endDate, "day");
        for (RevenueByPeriodResponse r : data) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, REVENUE_PERIOD_HEADERS, widths);
            }
            y = writePdfTableRow(cs, font, y, new String[]{
                    r.getPeriod(),
                    String.valueOf(r.getRevenue()),
                    String.valueOf(r.getOrderCount())
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Top Products ====================
    private void writeTopProductsPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao san pham ban chay");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {30, 180, 120, 80, 120};
        y = writePdfTableHeader(cs, font, y, TOP_PRODUCT_HEADERS, widths);

        List<TopProductResponse> data = statisticsService.getTopProducts(20, startDate, endDate);
        for (int i = 0; i < data.size(); i++) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, TOP_PRODUCT_HEADERS, widths);
            }
            TopProductResponse p = data.get(i);
            y = writePdfTableRow(cs, font, y, new String[]{
                    String.valueOf(i + 1),
                    p.getProductName(),
                    p.getCategoryName(),
                    String.valueOf(p.getTotalQuantity()),
                    String.valueOf(p.getTotalRevenue())
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Order Status ====================
    private void writeOrderStatusPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao trang thai don hang");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {160, 120, 120};
        y = writePdfTableHeader(cs, font, y, ORDER_STATUS_HEADERS, widths);

        List<OrderStatusDistributionResponse> data = statisticsService.getOrderStatusDistribution(startDate, endDate);
        for (OrderStatusDistributionResponse r : data) {
            y = writePdfTableRow(cs, font, y, new String[]{
                    r.getStatusName(),
                    String.valueOf(r.getCount()),
                    r.getPercentage() != null ? String.format("%.1f%%", r.getPercentage()) : "0%"
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Reviews ====================
    private void writeReviewPdf(PDDocument document, PDFont font) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao danh gia");
        float y = PDRectangle.A4.getHeight() - 100;
        ReviewStatsResponse stats = statisticsService.getReviewStats();

        cs.beginText();
        cs.setFont(font, 12);
        cs.newLineAtOffset(50, y);
        cs.showText("Danh gia trung binh: " + String.format("%.1f", stats.getAverageRating()) + " / 5");
        cs.endText();
        y -= 20;

        cs.beginText();
        cs.setFont(font, 12);
        cs.newLineAtOffset(50, y);
        cs.showText("Tong so danh gia: " + stats.getTotalReviews());
        cs.endText();
        y -= 30;

        float[] widths = {160, 120};
        y = writePdfTableHeader(cs, font, y, REVIEW_HEADERS, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"1 sao", String.valueOf(stats.getRating1Count())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"2 sao", String.valueOf(stats.getRating2Count())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"3 sao", String.valueOf(stats.getRating3Count())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"4 sao", String.valueOf(stats.getRating4Count())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"5 sao", String.valueOf(stats.getRating5Count())}, widths);

        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Refunds ====================
    private void writeRefundPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao hoan tien");
        float y = PDRectangle.A4.getHeight() - 100;
        RefundStatsResponse stats = statisticsService.getRefundStats(startDate, endDate);

        cs.beginText();
        cs.setFont(font, 12);
        cs.newLineAtOffset(50, y);
        cs.showText("Tong so hoan tien: " + stats.getTotalRefunds());
        cs.endText();
        y -= 20;

        cs.beginText();
        cs.setFont(font, 12);
        cs.newLineAtOffset(50, y);
        cs.showText("Ty le hoan tien: " + String.format("%.1f%%", stats.getRefundRate()));
        cs.endText();
        y -= 30;

        float[] widths = {160, 120};
        y = writePdfTableHeader(cs, font, y, REFUND_HEADERS, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"PENDING", String.valueOf(stats.getPendingCount())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"APPROVED", String.valueOf(stats.getApprovedCount())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"REJECTED", String.valueOf(stats.getRejectedCount())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"REFUNDED", String.valueOf(stats.getRefundedCount())}, widths);

        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Vouchers ====================
    private void writeVoucherPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao voucher");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {80, 100, 80, 120, 100};
        y = writePdfTableHeader(cs, font, y, VOUCHER_HEADERS, widths);

        List<VoucherStatsResponse> data = statisticsService.getVoucherStats(startDate, endDate);
        for (VoucherStatsResponse v : data) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, VOUCHER_HEADERS, widths);
            }
            y = writePdfTableRow(cs, font, y, new String[]{
                    v.getCode(),
                    String.valueOf(v.getDiscountValue()),
                    String.valueOf(v.getUsageCount()),
                    String.valueOf(v.getTotalDiscountGiven()),
                    Boolean.TRUE.equals(v.getIsActive()) ? "Hoat dong" : "Khong HD"
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Carbon ====================
    private void writeCarbonPdf(PDDocument document, PDFont font) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao chi so carbon");
        float y = PDRectangle.A4.getHeight() - 100;
        CarbonIndexStatsResponse stats = statisticsService.getCarbonIndexStats();

        cs.beginText();
        cs.setFont(font, 12);
        cs.newLineAtOffset(50, y);
        cs.showText("Chi so carbon trung binh: " + String.format("%.2f", stats.getAverageCarbonIndex()));
        cs.endText();
        y -= 30;

        float[] widths = {200, 120};
        y = writePdfTableHeader(cs, font, y, CARBON_HEADERS, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"Thap (<5.0)", String.valueOf(stats.getLowCarbonCount())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"Trung binh (5.0-15.0)", String.valueOf(stats.getMediumCarbonCount())}, widths);
        y = writePdfTableRow(cs, font, y, new String[]{"Cao (>=15.0)", String.valueOf(stats.getHighCarbonCount())}, widths);

        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Top Customers ====================
    private void writeTopCustomerPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao top khach hang");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {30, 140, 80, 120, 120};
        y = writePdfTableHeader(cs, font, y, TOP_CUSTOMER_HEADERS, widths);

        List<TopCustomerResponse> data = statisticsService.getTopCustomers(20, startDate, endDate);
        for (int i = 0; i < data.size(); i++) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, TOP_CUSTOMER_HEADERS, widths);
            }
            TopCustomerResponse c = data.get(i);
            y = writePdfTableRow(cs, font, y, new String[]{
                    String.valueOf(i + 1),
                    c.getUsername(),
                    String.valueOf(c.getTotalOrders()),
                    String.valueOf(c.getTotalSpent()),
                    String.valueOf(c.getAverageOrderValue())
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: Inventory ====================
    private void writeInventoryPdf(PDDocument document, PDFont font) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao hang ton kho");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {30, 160, 120, 80, 100};
        y = writePdfTableHeader(cs, font, y, INVENTORY_HEADERS, widths);

        InventoryOverviewResponse overview = statisticsService.getInventoryOverview();
        List<InventoryDetailResponse> data = overview.getDetails();
        for (int i = 0; i < data.size(); i++) {
            if (y < 50) {
                writePdfFooter(cs, font, document.getNumberOfPages());
                cs.close();
                page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                cs = new PDPageContentStream(document, page);
                y = PDRectangle.A4.getHeight() - 50;
                y = writePdfTableHeader(cs, font, y, INVENTORY_HEADERS, widths);
            }
            InventoryDetailResponse d = data.get(i);
            y = writePdfTableRow(cs, font, y, new String[]{
                    String.valueOf(i + 1),
                    d.getProductName(),
                    d.getCategoryName(),
                    String.valueOf(d.getInventory()),
                    d.getPrice() != null ? String.valueOf(d.getPrice()) : "0"
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: New Customers ====================
    private void writeNewCustomerPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);
        PDPageContentStream cs = new PDPageContentStream(document, page);

        writePdfTitle(cs, font, "Bao cao khach hang moi");
        float y = PDRectangle.A4.getHeight() - 100;
        float[] widths = {200, 200};
        y = writePdfTableHeader(cs, font, y, NEW_CUSTOMER_HEADERS, widths);

        List<NewCustomerStatsResponse> data = statisticsService.getNewCustomerStats(startDate, endDate);
        for (NewCustomerStatsResponse s : data) {
            y = writePdfTableRow(cs, font, y, new String[]{
                    s.getPeriod(),
                    String.valueOf(s.getCount())
            }, widths);
        }
        writePdfFooter(cs, font, document.getNumberOfPages());
        cs.close();
    }

    // ==================== PDF: All ====================
    private void writeAllPdf(PDDocument document, PDFont font, String startDate, String endDate) throws IOException {
        writeRevenueByCategoryPdf(document, font, startDate, endDate);
        writeRevenueByPeriodPdf(document, font, startDate, endDate);
        writeTopProductsPdf(document, font, startDate, endDate);
        writeOrderStatusPdf(document, font, startDate, endDate);
        writeReviewPdf(document, font);
        writeRefundPdf(document, font, startDate, endDate);
        writeVoucherPdf(document, font, startDate, endDate);
        writeCarbonPdf(document, font);
        writeTopCustomerPdf(document, font, startDate, endDate);
        writeInventoryPdf(document, font);
        writeNewCustomerPdf(document, font, startDate, endDate);
    }
}
