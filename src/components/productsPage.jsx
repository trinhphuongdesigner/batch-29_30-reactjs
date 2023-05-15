import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Alert,
  Popconfirm,
  Space,
  Modal,
  Select,
} from 'antd';
import numeral from 'numeral';
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import axiosClient from '../libraries/axiosClient';

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [refresh, setRefresh] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onShowToast = useCallback(
    ({
      message = 'Thành công',
      description = 'Thành công',
      type = MESSAGE_TYPE.SUCCESS,
    }) => {
      return (
        <Alert
          message={message}
          description={description}
          type={type}
          showIcon
        />
      );
    },
    [],
  );

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onFinish = useCallback(
    async (values) => {
      try {
        await axiosClient.post('/products', values);

        setRefresh((preState) => preState + 1);
        createForm.resetFields();

        onShowMessage('Thêm sản phẩm thành công');

        // setRefresh(refresh + 1);

        // CASE 1
        // const newItem = res.data.payload;

        // setProducts((preState) => ([
        //   ...preState,
        //   newItem,
        // ]))
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowToast({
              message: 'Lỗi',
              description: e,
            }),
          );
        }
      }
    },
    [createForm, onShowMessage, onShowToast],
  );

  // const onSelectProduct = useCallback(
  //   (data) => () => {
  //     setEditModalVisible(true);
  //     setSelectedProduct(data);
  //     updateForm.setFieldsValue(data);
  //     console.log(data);
  //   },
  //   [updateForm],
  // );

  // const onDeleteProduct = useCallback((id) => async () => {
  //   try {
  //     const response = await axiosClient.delete(`products/${id}`);
  //     console.log(response);
  //     setRefresh((prevState) => prevState + 1);
  //   } catch (error) {
  //     console.log('««««« error »»»»»', error);
  //   }
  // }, []);

  const onEditFinish = useCallback(
    (values) => {
      try {
        const response = axiosClient.patch(
          `products/${selectedProduct.id}`,
          values,
        );

        if (response.status === 200) {
          updateForm.resetFields();
          setEditModalVisible(false);
          setRefresh((prevState) => prevState + 1);
        }
      } catch (error) {
        console.log('««««« error »»»»»', error);
      }
    },
    [selectedProduct?.id, updateForm],
  );

  const columns = [
    {
      title: 'No',
      dataIndex: 'No',
      key: 'no',
      width: '1%',
      render: function (a, b, c) {
        return <span>{c + 1}</span>;
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      key: 'id',
    },
    {
      title: 'Tên SP',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: function (text, record, index) {
        const { discount, price } = record;
        const realPrice = (price * (100 - discount)) / 100;

        return <strong>{numeral(realPrice).format('0,0$')}</strong>;
      },
    },
    // {
    //   title: '',
    //   key: 'actions',
    //   width: '1%',
    //   render: (text, record, index) => {
    //     return (
    //       <Space>
    //         <Button
    //           type="dashed"
    //           icon={<EditOutlined />}
    //           onClick={onSelectProduct(record)}
    //         />

    //         <Popconfirm
    //           title="Are you sure to delete?"
    //           okText="Đồng ý"
    //           cancelText="Đóng"
    //           onConfirm={onDeleteProduct(record.id)}
    //         >
    //           <Button danger type="dashed" icon={<DeleteOutlined />} />
    //         </Popconfirm>
    //       </Space>
    //     );
    //   },
    // },
  ];

  const getSuppliers = useCallback(async () => {
    try {
      // const res = await axiosClient.get('/suppliers');
      const res = await axiosClient.get('/products');
      setSuppliers(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      // const res = await axiosClient.get('/categories');
      const res = await axiosClient.get('/products');
      setCategories(res.data.payload || []);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProductData = useCallback(async () => {
    try {
      const res = await axiosClient.get('/products');
      setProducts(res.data.payload);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getSuppliers();

    getCategories();
  }, [getCategories, getSuppliers]);

  useEffect(() => {
    // axios
    //   .get('http://localhost:3333/products')
    //   .then(function (response) {
    //     setProducts(response.data.payload);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    getProductData();
  }, [getProductData, refresh]);

  return (
    <div className="App">
      {contextHolder}
      <Form
        form={createForm}
        name="add-product-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Danh mục sản phẩm"
          name="categoryId"
          rules={[
            {
              required: true,
              message: 'Please input product categpry!',
            },
          ]}
        >
          <Select
            options={
              categories &&
              categories.map((c) => {
                return {
                  value: c.id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Nhà cung cấp"
          name="supplierId"
          rules={[
            {
              required: true,
              message: 'Please input product supplier!',
            },
          ]}
        >
          <Select
            options={
              suppliers &&
              suppliers.map((c) => {
                return {
                  value: c.id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm' },
            { max: 50, message: 'Tối đa 50 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá gốc"
          name="price"
          rules={[
            {
              type: 'number',
              min: 0,
              message: 'Vui lòng nhập giá gốc từ 0 đến 100',
            },
            { required: true, message: 'Vui lòng nhập giá gốc' },
          ]}
        >
          <InputNumber style={{ width: '100%'}}/>
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input />
        </Form.Item>

        <Form.Item
          label="Giảm giá"
          name="discount"
          rules={[
            {
              type: 'number',
              min: 0,
              max: 100,
              message: 'Vui lòng nhập giảm giá từ 0 đến 100',
            },
            { required: true, message: 'Vui lòng nhập giảm giá' },
          ]}
        >
          <InputNumber style={{ width: '100%'}} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table rowKey="id" dataSource={products} columns={columns} />

      <Modal
        open={editModalVisible}
        centered
        title="Cập nhật thông tin"
        onCancel={() => {
          setEditModalVisible(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-product"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onEditFinish}
        >
          {/* <Form.Item
            label="Danh mục sản phẩm"
            name="categoryId"
            rules={[
              {
                required: true,
                message: 'Please input product categpry!',
              },
            ]}
          >
            <Select
              options={
                categories.length > 0 &&
                categories.map((c) => {
                  return {
                    value: c.id,
                    label: c.name,
                  };
                })
              }
            />
          </Form.Item> */}

          {/* <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            rules={[
              {
                required: true,
                message: 'Please input product supplier!',
              },
            ]}
          >
            <Select
              options={
                suppliers.length > 0 &&
                suppliers.map((c) => {
                  return {
                    value: c.id,
                    label: c.name,
                  };
                })
              }
            />
          </Form.Item> */}

          {/* <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input product name!',
              },
            ]}
          >
            <Input />
          </Form.Item> */}

          {/* <Form.Item
            label="Giá bán"
            name="price"
            rules={[
              {
                required: true,
                message: 'Please input product price!',
              },
            ]}
          >
            <InputNumber />
          </Form.Item> */}

          {/* <Form.Item
            label="Giảm (%)"
            name="discount"
            rules={[
              {
                required: true,
                message: 'Please input product discount!',
              },
            ]}
          >
            <InputNumber />
          </Form.Item> */}

          {/* <Form.Item
            label="Tồn"
            name="stock"
            rules={[
              {
                required: true,
                message: 'Please input product stock!',
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
}
