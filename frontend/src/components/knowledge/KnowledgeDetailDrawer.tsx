import {
    Descriptions,
    Drawer,
    Tag,
    Typography,
} from "antd";

import type {
    KnowledgeDocumentDetail,
} from "../../types/knowledge";

interface Props {

    open: boolean;

    onClose: () => void;

    document?: KnowledgeDocumentDetail;

}

export default function KnowledgeDetailDrawer({

    open,

    onClose,

    document,

}: Props) {

    return (

        <Drawer

            title="Chi tiết tài liệu"

            size={700}

            open={open}

            onClose={onClose}

        >

            {!document && null}

            {document && (

                <>

                    <Descriptions
                        bordered
                        column={1}
                    >

                        <Descriptions.Item label="Tên">

                            {document.fileName}

                        </Descriptions.Item>

                        <Descriptions.Item label="Loại">

                            {document.documentType}

                        </Descriptions.Item>

                        <Descriptions.Item label="Kích thước">

                            {(document.fileSize / 1024).toFixed(2)} KB

                        </Descriptions.Item>

                        <Descriptions.Item label="Chunks">

                            {document.chunkCount}

                        </Descriptions.Item>

                        <Descriptions.Item label="Characters">

                            {document.characterCount}

                        </Descriptions.Item>

                        <Descriptions.Item label="Words">

                            {document.wordCount}

                        </Descriptions.Item>

                        <Descriptions.Item label="Status">

                            <Tag color="green">

                                {document.status}

                            </Tag>

                        </Descriptions.Item>

                        <Descriptions.Item label="Uploaded">

                            {new Date(
                                document.uploadedAt + "Z"
                            ).toLocaleString()}

                        </Descriptions.Item>

                    </Descriptions>

                    <Typography.Title
                        level={5}
                        style={{
                            marginTop: 24,
                        }}
                    >

                        Preview

                    </Typography.Title>

                    <Typography.Paragraph>

                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                fontFamily: "inherit",
                            }}
                        >

                            {document.preview}

                        </pre>

                    </Typography.Paragraph>

                </>

            )}

        </Drawer>

    );

}