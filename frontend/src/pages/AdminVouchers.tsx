import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Card, Col, Descriptions, Flex, Row, Space, Spin, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";

import { message } from "antd";

import { createVoucher, updateVoucher, deleteVoucher } from "../services/voucher.service";
import {
    Modal,
    Form,
    InputNumber,
    DatePicker,
    Switch,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from "@ant-design/icons";

import {
    Popconfirm,
    Tooltip,
} from "antd";

import { getAllForAdmin } from "../services/voucher.service";
import type { VoucherSummary, VoucherQuery, VoucherResponse, VoucherPatchRequest } from "../model/voucher.model";
import type { PageResponse } from "../model/page.model";
import { getById } from "../services/voucher.service";

import { Input } from "antd";
import { Select } from "antd";

const { Search } = Input;

const { Title } = Typography;

export default function AdminVouchers() {

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [form] = Form.useForm();
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [editLoading, setEditLoading] = useState(false);

    const [updating, setUpdating] = useState(false);

    const [editingVoucherId, setEditingVoucherId] =
        useState<number>();

    const [editingVoucher, setEditingVoucher] =
        useState<VoucherResponse | null>(null);
    const [editForm] = Form.useForm();

    const [selectedVoucher, setSelectedVoucher] =
        useState<VoucherResponse | null>(null);

    const [viewLoading, setViewLoading] = useState(false);

    const [voucherPage, setVoucherPage] =
        useState<PageResponse<VoucherSummary>>();

    const [query, setQuery] = useState<VoucherQuery>({
        page: 0,
        size: 10,
        sortBy: "expiredAt",
        direction: "desc",
    });

    async function loadVouchers() {

        try {

            setLoading(true);

            const data = await getAllForAdmin(query);

            setVoucherPage(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadVouchers();

    }, [query]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setQuery((prev) => {

                const keyword = searchText.trim() || undefined;

                if (prev.keyword === keyword) {
                    return prev;
                }

                return {
                    ...prev,
                    page: 0,
                    keyword,
                };

            });

        }, 300);

        return () => clearTimeout(timer);

    }, [searchText]);

    const columns: ColumnsType<VoucherSummary> = [

        {
            title: "Code",
            dataIndex: "code",
        },

        // {
        //     title: "Description",
        //     dataIndex: "description",
        // },

        {
            title: "Discount",
            dataIndex: "discountValue",
            align: "center",

            render: (value: number) => `${value}%`,
        },

        {
            title: "Quantity",
            dataIndex: "quantity",
            align: "center",
        },

        {
            title: "Expired Date",
            dataIndex: "expiredAt",
            key: "expiredAt",
            width: 140,
            align: "center",

            render: (value: string) =>
                dayjs(value).format("DD/MM/YYYY"),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            align: "center",
            width: 120,

            render: (isActive: boolean) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },


        {
            title: "Actions",
            key: "actions",
            width: 140,
            align: "center",

            render: (_, record) => (

                <Space size="small">

                    <Tooltip title="View">

                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {

                                handleView(record.voucherId);

                            }}
                        />

                    </Tooltip>

                    <Tooltip title="Edit">

                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record.voucherId)}
                        />

                    </Tooltip>

                    <Popconfirm
                        title="Delete voucher?"
                        description="This action cannot be undone."
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => handleDelete(record.voucherId)}
                    >

                        <Tooltip title="Delete">

                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined />}
                            />

                        </Tooltip>

                    </Popconfirm>

                </Space>

            ),
        },

    ];
    async function handleDelete(id: number) {

        try {

            await deleteVoucher(id);

            message.success("Voucher deleted.");

            loadVouchers();

        }

        catch {

            message.error("Failed to delete voucher.");

        }

    }

    async function handleUpdate(values: any) {

        if (!editingVoucher || !editingVoucherId) {
            return;
        }

        const request: VoucherPatchRequest = {};

        if (values.code !== editingVoucher.code) {
            request.code = values.code;
        }

        if (values.description !== editingVoucher.description) {
            request.description = values.description;
        }

        if (values.discountValue !== editingVoucher.discountValue) {
            request.discountValue = values.discountValue;
        }

        if (values.quantity !== editingVoucher.quantity) {
            request.quantity = values.quantity;
        }

        const startedAt = values.startedAt?.format("YYYY-MM-DD");
        if (startedAt !== editingVoucher.startedAt) {
            request.startedAt = startedAt;
        }

        const expiredAt = values.expiredAt?.format("YYYY-MM-DD");
        if (expiredAt !== editingVoucher.expiredAt) {
            request.expiredAt = expiredAt;
        }

        if (values.isActive !== editingVoucher.isActive) {
            request.isActive = values.isActive;
        }

        if (Object.keys(request).length === 0) {

            message.info("No changes detected.");

            return;
        }

        try {

            setUpdating(true);

            await updateVoucher(
                editingVoucherId,
                request
            );

            message.success("Voucher updated successfully.");

            editForm.resetFields();

            setEditingVoucher(null);

            setEditOpen(false);

            loadVouchers();

        } catch (error) {

            console.error(error);

            message.error("Failed to update voucher.");

        } finally {

            setUpdating(false);

        }

    }

    async function handleEdit(id: number) {

        try {

            setEditLoading(true);

            const voucher = await getById(id);

            setEditingVoucher(voucher);

            editForm.setFieldsValue({

                code: voucher.code,
                description: voucher.description,
                discountValue: voucher.discountValue,
                quantity: voucher.quantity,
                startedAt: dayjs(voucher.startedAt),
                expiredAt: dayjs(voucher.expiredAt),
                isActive: voucher.isActive,

            });

            setEditingVoucherId(id);

            setEditOpen(true);

        } catch (error) {

            console.error(error);

            message.error("Failed to load voucher.");

        } finally {

            setEditLoading(false);

        }

    }

    async function handleView(id: number) {

        try {

            setViewLoading(true);

            const voucher = await getById(id);

            setSelectedVoucher(voucher);

            setViewOpen(true);

        } catch (error) {

            console.error(error);

            message.error("Failed to load voucher.");

        } finally {

            setViewLoading(false);

        }

    }

    async function handleCreate(values: any) {

        try {

            const request = {

                ...values,

                startedAt: dayjs(values.startedAt)
                    .format("YYYY-MM-DD"),

                expiredAt: dayjs(values.expiredAt)
                    .format("YYYY-MM-DD"),

            };

            await createVoucher(request);

            message.success("Voucher created successfully.");

            form.resetFields();

            setCreateOpen(false);

            loadVouchers();

        } catch (error) {

            console.error(error);

            message.error("Failed to create voucher.");

        }

    }
    console.log(form === editForm);

    return (

        <Card>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Space>
                    <Search
                        placeholder="Search code or description..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 350 }}
                    />

                    <Select
                        value={query.active}
                        placeholder="Status"
                        allowClear
                        style={{ width: 150 }}
                        onChange={(value) => {

                            setQuery((prev) => ({

                                ...prev,

                                page: 0,

                                active: value,

                            }));

                        }}
                        options={[
                            {
                                label: "Active",
                                value: true,
                            },
                            {
                                label: "Inactive",
                                value: false,
                            },
                        ]}
                    />
                </Space>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateOpen(true)}
                >
                    Add Voucher
                </Button>

            </Flex>
            <Table

                rowKey="voucherId"

                loading={loading}

                columns={columns}

                dataSource={voucherPage?.content}

                pagination={{
                    current: query.page + 1,
                    pageSize: query.size,
                    total: voucherPage?.totalElements,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} vouchers`,

                    onChange: (page, pageSize) => {

                        setQuery((prev) => ({
                            ...prev,
                            page: page - 1,
                            size: pageSize,
                        }));

                    },
                }}

            />
            <Modal
                title="Add Voucher"
                open={createOpen}
                onCancel={() => {

                    form.resetFields();

                    setCreateOpen(false);

                }}
                onOk={() => form.submit()}
                okText="Create"
            >
                <div
                    style={{
                        maxHeight: "calc(100vh - 220px)",
                        overflowY: "auto",
                        paddingRight: 8,
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreate}
                    >

                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter voucher code.",
                                },
                            ]}
                        >

                            <Input />

                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter description.",
                                },
                            ]}
                        >

                            <Input.TextArea rows={3} />

                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Discount (%)"
                                    name="discountValue"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <InputNumber
                                        min={1}
                                        max={100}
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Quantity"
                                    name="quantity"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <InputNumber
                                        min={1}
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Start Date"
                                    name="startedAt"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <DatePicker
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Expired Date"
                                    name="expiredAt"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <DatePicker
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Active"
                            name="isActive"
                            valuePropName="checked"
                            initialValue={true}
                        >

                            <Switch />

                        </Form.Item>

                    </Form>
                </div>

            </Modal>
            <Modal
                title="Edit Voucher"
                open={editOpen}
                forceRender
                onCancel={() => {

                    editForm.resetFields();
                    setEditingVoucher(null);

                    setEditOpen(false);

                }}
                confirmLoading={updating}
                onOk={() => editForm.submit()}
                okText="Save"
            >
                <div
                    style={{
                        maxHeight: "calc(100vh - 220px)",
                        overflowY: "auto",
                        paddingRight: 8,
                    }}
                >
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleUpdate}
                    >

                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter voucher code.",
                                },
                            ]}
                        >

                            <Input />

                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter description.",
                                },
                            ]}
                        >

                            <Input.TextArea rows={3} />

                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Discount (%)"
                                    name="discountValue"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <InputNumber
                                        min={1}
                                        max={100}
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Quantity"
                                    name="quantity"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <InputNumber
                                        min={1}
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Start Date"
                                    name="startedAt"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <DatePicker
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Expired Date"
                                    name="expiredAt"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >

                                    <DatePicker
                                        style={{
                                            width: "100%",
                                        }}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="Active"
                            name="isActive"
                            valuePropName="checked"
                        // initialValue={true}
                        >

                            <Switch />

                        </Form.Item>

                    </Form>
                </div>

            </Modal>
            <Spin spinning={viewLoading}>
                <Modal
                    title="Voucher Details"
                    open={viewOpen}
                    footer={null}
                    width={600}
                    onCancel={() => {

                        setViewOpen(false);

                        setSelectedVoucher(null);

                    }}
                >
                    <Descriptions
                        bordered
                        column={1}
                        size="small"
                    >
                        <Descriptions.Item label="Code">
                            {selectedVoucher?.code}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {selectedVoucher?.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Discount">
                            {selectedVoucher?.discountValue}%
                        </Descriptions.Item>
                        <Descriptions.Item label="Quantity">
                            {selectedVoucher?.quantity}
                        </Descriptions.Item>
                        <Descriptions.Item label="Start Date">
                            {dayjs(selectedVoucher?.startedAt).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Expired Date">
                            {dayjs(selectedVoucher?.expiredAt).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">

                            <Tag
                                color={
                                    selectedVoucher?.isActive
                                        ? "green"
                                        : "red"
                                }
                            >
                                {selectedVoucher?.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </Tag>

                        </Descriptions.Item>
                    </Descriptions>
                </Modal></Spin>

        </Card>



    );

}