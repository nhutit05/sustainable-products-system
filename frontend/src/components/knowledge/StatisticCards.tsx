import { Card, Col, Row, Statistic } from "antd";
import {
    FileTextOutlined,
    DatabaseOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

import type { KnowledgeStatistics } from "../../types/knowledge";

interface Props {
    statistics?: KnowledgeStatistics;
}

export default function StatisticCards({
    statistics,
}: Props) {

    return (

        <Row gutter={[16,16]}>

            <Col xs={24} sm={12} xl={6}>
                <Card>
                    <Statistic
                        title="Tài liệu"
                        value={statistics?.totalDocuments ?? 0}
                        prefix={<FileTextOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
                <Card>
                    <Statistic
                        title="Chunks"
                        value={statistics?.totalChunks ?? 0}
                        prefix={<DatabaseOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
                <Card>
                    <Statistic
                        title="Embedded"
                        value={statistics?.embeddedDocuments ?? 0}
                        prefix={<CheckCircleOutlined />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} xl={6}>
                <Card>
                    <Statistic
                        title="Failed"
                        value={statistics?.failedDocuments ?? 0}
                        prefix={<CloseCircleOutlined />}
                    />
                </Card>
            </Col>

        </Row>

    );

}