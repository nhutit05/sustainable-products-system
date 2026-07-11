import { useState } from "react";

import {
    Button,
    Card,
    Space,
    Typography,
    Upload,
    message,
} from "antd";

import {
    InboxOutlined,
    UploadOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import type { UploadProps } from "antd";

import { uploadDocument } from "../../services/knowledge.service";

const { Title, Text } = Typography;

interface UploadCardProps {
    refreshData: () => Promise<void>;
}

const UploadCard = ({
    refreshData,
}: UploadCardProps) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {

        const isPdf = file.type === "application/pdf";

        const isDocx =
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        if (!isPdf && !isDocx) {
            message.error("Chỉ hỗ trợ file PDF hoặc DOCX.");
            return Upload.LIST_IGNORE;
        }

        setSelectedFile(file);

        return false;
    };

    const handleClear = () => {
        setSelectedFile(null);
    };

   const handleUpload = async () => {

    if (!selectedFile) {

        message.warning("Vui lòng chọn tài liệu.");

        return;

    }

    const token = localStorage.getItem("token") ?? "";

    try {

        setUploading(true);

        await uploadDocument(
            token,
            selectedFile
        );

        message.success(
            "Upload tài liệu thành công."
        );

        setSelectedFile(null);

        await refreshData();

    } catch (error) {

        console.error(error);

        message.error(
            "Upload thất bại."
        );

    } finally {

        setUploading(false);

    }

};
    return (
        <Card
            style={{
                borderRadius: 12,
            }}
        >
            <Space
                orientation="vertical"
                size="large"
                style={{
                    width: "100%",
                }}
            >

                <div>
                    <Title level={4}>
                        Upload tài liệu
                    </Title>

                    <Text type="secondary">
                        Kéo thả hoặc chọn tài liệu PDF / DOCX để bổ sung tri thức cho chatbot.
                    </Text>
                </div>

                <Upload.Dragger
                    maxCount={1}
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    accept=".pdf,.docx"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>

                    <p className="ant-upload-text">
                        Kéo & thả file vào đây
                    </p>

                    <p className="ant-upload-hint">
                        hoặc nhấn để chọn tài liệu
                    </p>

                    <Text type="secondary">
                        Chỉ hỗ trợ PDF và DOCX
                    </Text>
                </Upload.Dragger>

                {selectedFile && (
                    <Card
                        size="small"
                        style={{
                            background: "#fafafa",
                        }}
                    >
                        <Space orientation="vertical">

                            <Text strong>
                                File đã chọn
                            </Text>

                            <Text>
                                {selectedFile.name}
                            </Text>

                            <Text type="secondary">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Text>

                        </Space>
                    </Card>
                )}

                <Space wrap>

                    <Button
    type="primary"
    icon={<UploadOutlined />}
    disabled={!selectedFile}
    loading={uploading}
    onClick={handleUpload}
    /
>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={!selectedFile}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>

                </Space>

            </Space>
        </Card>
    );
};

export default UploadCard;

