import React, { memo } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';

function AddProductForm(props) {
  const {
    createForm,
    onFinish,
  } = props;

  return (
    <Form
    form={createForm}
    className=""
    name="add-product-form"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ 
      maxWidth: 900,
      margin: '60px auto'
    }}
    onFinish={onFinish}
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
    </Form.Item> */}

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
  )
}

export default memo(AddProductForm);
