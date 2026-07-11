import UploadCard from "../../components/knowledge/UploadCard";
import StatisticCards from "../../components/knowledge/StatisticCards";
import KnowledgeToolbar from "../../components/knowledge/KnowledgeToolbar";
import DocumentTable from "../../components/knowledge/DocumentTable";
import DeleteDialog from "../../components/knowledge/DeleteDialog";

import { useCallback, useEffect, useState } from "react";

import { Col, Row, Space, Typography } from "antd";

import {
    getDocument,
} from "../../services/knowledge.service";

import KnowledgeDetailDrawer from "../../components/knowledge/KnowledgeDetailDrawer";

import type {
    KnowledgeDocumentDetail,
} from "../../types/knowledge";

import {
    getDocuments,
    getStatistics,
} from "../../services/knowledge.service";

import type {
    KnowledgeDocument,
    KnowledgeStatistics,
} from "../../types/knowledge";

const { Title, Text } = Typography;

const KnowledgePage = () => {

    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);

    const [statistics, setStatistics] =
        useState<KnowledgeStatistics>();

    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token") ?? "";

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedDocument, setSelectedDocument] =
        useState<KnowledgeDocumentDetail>();

        const [keyword, setKeyword] = useState("");

const [statusFilter, setStatusFilter] = useState("ALL");

const filteredDocuments = documents.filter((document) => {

    const matchKeyword =
        document.fileName
            .toLowerCase()
            .includes(keyword.toLowerCase());

    const matchStatus =
        statusFilter === "ALL"
            ? true
            : document.status === statusFilter;

    return matchKeyword && matchStatus;

});

    const fetchDocuments = useCallback(async () => {

        const data = await getDocuments(token);
        console.log("Documents:", data);

        setDocuments(data);

    }, [token]);

    const fetchStatistics = useCallback(async () => {

        const data = await getStatistics(token);

        setStatistics(data);

    }, [token]);

    const refreshData = useCallback(async () => {

        setLoading(true);

        try {

            await Promise.all([
                fetchDocuments(),
                fetchStatistics(),
            ]);

        } finally {

            setLoading(false);

        }

    }, [
        fetchDocuments,
        fetchStatistics,
    ]);

    const handleView = useCallback(
        async (documentId: string) => {

            try {

                const data = await getDocument(
                    token,
                    documentId
                );

                setSelectedDocument(data);

                setDrawerOpen(true);

            } catch (error) {

                console.error(error);

            }

        },
        [token]
    );

    useEffect(() => {

        refreshData();

    }, [refreshData]);




    return (
<Row gutter={[24, 24]}>

        <Space
            orientation="vertical"
            size="large"
            style={{ width: "97%", padding: 10}}
        >

 
            
       <Col xs={24}>
        <UploadCard refreshData={refreshData}/>
    </Col>

<Col xs={24}>
        <KnowledgeToolbar
    keyword={keyword}
    statusFilter={statusFilter}
    onKeywordChange={setKeyword}
    onStatusChange={setStatusFilter}
    onRefresh={refreshData}
/>
</Col>

            <Col xs={24}>
        <StatisticCards statistics={statistics}/>
    </Col>

            <Row>

                <Col span={24}>

                    <DocumentTable
                        documents={filteredDocuments}
                        loading={loading}
                        refreshData={refreshData}
                        onView={handleView}
                    />

                </Col>

            </Row>
<Col xs={24}>
            <KnowledgeDetailDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                document={selectedDocument}
            />
             </Col>

        </Space>
        </Row>

    );
};

export default KnowledgePage;