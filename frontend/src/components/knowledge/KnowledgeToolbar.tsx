import {
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import {
    Button,
    Card,
    Flex,
    Input,
    Select,
    Space,
} from "antd";

interface KnowledgeToolbarProps {

    keyword: string;

    statusFilter: string;

    onKeywordChange: (value: string) => void;

    onStatusChange: (value: string) => void;

    onRefresh: () => void;

}

const KnowledgeToolbar = ({
    keyword,
    statusFilter,
    onKeywordChange,
    onStatusChange,
    onRefresh,
}: KnowledgeToolbarProps) => {

    return (
        <Space
    wrap
    style={{
        width:"100%",
        justifyContent:"space-between"
    }}
>
        <Card>

            <Space
                wrap
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >

                <Space wrap>

                    <Input
                        allowClear
                        value={keyword}
                        onChange={(e) =>
                            onKeywordChange(e.target.value)
                        }
                        placeholder="Tìm kiếm tài liệu..."
                        prefix={<SearchOutlined />}
                        style={{

                            width: "100%",
                            maxWidth: 320
                        }}
                    />

                    <Select
                        value={statusFilter}
                        onChange={onStatusChange}
                        style={{
                            width: 180,
                        }}
                        options={[
                            { label: "Tất cả trạng thái", value: "ALL" },
                            { label: "UPLOADED", value: "UPLOADED" },
                            { label: "PARSED", value: "PARSED" },
                            { label: "CHUNKED", value: "CHUNKED" },
                            { label: "EMBEDDED", value: "EMBEDDED" },
                            { label: "FAILED", value: "FAILED" },
                        ]}
                    />
                </Space>

                <Button
                    icon={<ReloadOutlined />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

            </Space>

        </Card>
        </Space>
    );
};

export default KnowledgeToolbar;

