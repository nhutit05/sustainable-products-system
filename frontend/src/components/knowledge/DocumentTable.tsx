import {
    Button,
    message,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    EyeOutlined,
    FilePdfOutlined,
    FileWordOutlined,
} from "@ant-design/icons";

import type { KnowledgeDocument } from "../../types/knowledge";
import { deleteDocument } from "../../services/knowledge.service";

const { Text } = Typography;

interface DocumentTableProps {

    documents: KnowledgeDocument[];

    loading: boolean;

    refreshData: () => Promise<void>;

    onView: (
        documentId: string
    ) => void;

}

export default function DocumentTable({

    documents,

    loading,

    refreshData,

    onView,

}: DocumentTableProps) {

    const token = localStorage.getItem("token") ?? "";

    const handleDelete = async (
        documentId: string
    ) => {

        try {

            await deleteDocument(
                token,
                documentId
            );

            message.success(
                "Xóa tài liệu thành công"
            );

            await refreshData();

        } catch (error) {

            console.error(error);

            message.error(
                "Xóa tài liệu thất bại"
            );

        }

    };

    const renderStatus = (
        status: string
    ) => {

        switch (status) {

            case "EMBEDDED":
                return (
                    <Tag color="green">
                        EMBEDDED
                    </Tag>
                );

            case "CHUNKED":
                return (
                    <Tag color="blue">
                        CHUNKED
                    </Tag>
                );

            case "PARSED":
                return (
                    <Tag color="gold">
                        PARSED
                    </Tag>
                );

            case "FAILED":
                return (
                    <Tag color="red">
                        FAILED
                    </Tag>
                );

            case "UPLOADED":
                return (
                    <Tag>
                        UPLOADED
                    </Tag>
                );

            default:
                return (
                    <Tag>
                        {status}
                    </Tag>
                );

        }

    };

    const columns: ColumnsType<KnowledgeDocument> = [

        {

            title: "Tài liệu",

            key: "document",

            render: (_, record) => (

                <Space
                    align="start"
                >

                    {record.documentType === "PDF"
                        ? (
                            <FilePdfOutlined
                                style={{
                                    color: "#ff4d4f",
                                    fontSize: 20,
                                    marginTop: 4,
                                }}
                            />
                        )
                        : (
                            <FileWordOutlined
                                style={{
                                    color: "#1677ff",
                                    fontSize: 20,
                                    marginTop: 4,
                                }}
                            />
                        )}

                    <Space
                        orientation="vertical"
                        size={0}
                    >

                        <Text strong>

                            {record.fileName}

                        </Text>

                        <Text
                            type="secondary"
                        >

                            {record.documentType}
                            {" • "}
                            {(record.fileSize / 1024).toFixed(2)} KB
                            {" • "}
                            {record.chunkCount} chunks

                        </Text>

                    </Space>

                </Space>

            ),

        },

        {

            title: "Trạng thái",

            dataIndex: "status",

            key: "status",

            width: 150,

            render: renderStatus,

        },

        {

            title: "Ngày tải lên",

            dataIndex: "uploadedAt",

            key: "uploadedAt",

            width: 200,

            render: (value: string) =>
                new Date(value).toLocaleString(),

        },

        {

            title: "Thao tác",

            key: "action",

            width: 180,

            render: (_, record) => (

                <Space>

                    <Button
                        icon={<EyeOutlined />}
                        onClick={() =>
                            onView(
                                record.documentId
                            )
                        }
                    >
                        Xem
                    </Button>

                    <Popconfirm
                        title="Xóa tài liệu?"
                        description="Bạn có chắc chắn muốn xóa tài liệu này?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() =>
                            handleDelete(
                                record.documentId
                            )
                        }
                    >

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>

                    </Popconfirm>

                </Space>

            ),

        },

    ];

    return (

        <Table 

            rowKey="documentId"

            columns={columns}

            dataSource={documents}

            loading={loading}

            pagination={{
                pageSize: 10,
                showSizeChanger: false,
            }}

            scroll={{x:900}}

        />

    );

}