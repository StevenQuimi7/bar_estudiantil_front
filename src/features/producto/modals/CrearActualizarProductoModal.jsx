import React, {useContext, useEffect, useState, useCallback} from 'react'
import { Modal, Button, Row, Col, Form, Input, Select, Upload, Image } from 'antd'
import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { ProductoContext } from '../context/ProductoContextProvider';
import { constants } from '../../../config/constants';
import { useSelector } from 'react-redux';
export const CrearActualizarProductoModal = ({
  open=false,
  toggle=()=>{},
  producto={},
  isCreate=true,
  titulo='',
}) => {
  
  const { 
    storeProducto, 
    updateProducto,  
    contextHolder, contextHolder2,
    consultaProductos,
    isLoading,
    comboCategorias,
    getComboCategorias
  } = useContext(ProductoContext);
  
  const [form] = Form.useForm();
  const [error, setError] = useState({});
  const [isUploading, setIsUploading] = useState(false)
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const token_usuario = useSelector((state) => state.auth.token);

  const onFinish = (values) =>{
    isCreate ? guardar(values) : actualizar(values);
  }

  const guardar = async(values)=>{
    if(fileList.length > 0){
      values.imagen = {
        name           : fileList[0].name,
        type           : fileList[0].type,
        nombre_archivo : fileList[0]?.response?.data?.nombre_archivo,
        path           : fileList[0]?.response?.data?.path
      };
    } 

    const response = await storeProducto(values);
    if(response.ok){
      consultaProductos();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }
  const actualizar = async(values)=>{
    const nuevoPath = fileList[0]?.response?.data?.path;
    const pathActual = producto?.image?.path ?? null;

    if (fileList.length > 0 && nuevoPath && nuevoPath !== pathActual) {
      values.imagen = {
        name           : fileList[0].name,
        type           : fileList[0].type,
        nombre_archivo : fileList[0]?.response?.data?.nombre_archivo,
        path           : nuevoPath,
      };
    }
    const response = await updateProducto(values);
    if(response.ok){
      consultaProductos();
      toggle();
    }else{
      if(response?.error?.validaciones !== null){
        toggle();
      }
      if(response?.error?.formulario !== null){
        setError(response.error.formulario);
      }
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        //reader.onload = () => {
        //     // Extraer la parte de la cadena Base64 después de la coma
        //const base64String = reader.result.split(',')[1];
        //resolve(base64String);
        //};
        reader.onerror = (error) => reject(error);
    });
  };

  const upload_props = {
    name: 'file',
    action: `${constants.URL_DOCUMENTOS}guardarTemporal`,
    headers: {
        Authorization: `Bearer ${token_usuario}`,
    },
  };

  const handlePreview = async (file) => {
    let previewData;
    if (!file.url && !file.preview) {
        previewData = await getBase64(file.originFileObj);
        file.preview = previewData;
    }
    setPreviewImage(file.url || file.preview || previewData);
    setPreviewOpen(true);
  };

  const handleBeforeUpload = (file) => {
    const isAllowedType = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
    if (!isAllowedType) {
        console.error("Archivo no permitido, solo puede subir archivos PNG, JPG.");
        return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = async ({ fileList: newFileList }) => {
    // 1. Actualizamos el estado inmediatamente para que se vea el progreso
    setFileList(newFileList);

    // 2. Solo procesamos la lógica extra cuando el archivo termina de subir
    const file = newFileList[0];

    if (file && file.status === 'uploading') {
      setIsUploading(true);
    }

    if (file && file.status === 'done') {
      setIsUploading(false);
      
      // Si el backend respondió correctamente
      const response = file.response;

      // Preparar base64 si es necesario
      if (!file.base64 && file.originFileObj) {
        file.base64 = await getBase64(file.originFileObj);
      }

      // Agregar datos extra al archivo dentro del estado
      file.tipo = mapFileType(file.type);
      file.ruta = response?.path; // Asegúrate que tu API devuelva 'path'

      // Forzamos una actualización final con los datos del servidor
      setFileList([...newFileList]);
    } else if (file && file.status === 'error') {
      setIsUploading(false);
      console.error('Error al subir el archivo:', file.error);
    }
  };


  const mapFileType = (mimeType) => {
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/jpg':
          return 'JPG';
      case 'image/png':
          return 'PNG';
      case 'application/pdf':
          return 'PDF';
      case 'dwg':
          return 'DWG';
          case 'image/vnd.dwg':
              return 'DWG';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'WORD';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'EXCEL';
      default:
          return mimeType;
    }
  };


  useEffect(() => {
    if (open) { 
      setError({});
      getComboCategorias()
      if (isCreate) {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open]);

  useEffect(() => {
    if (open && !isCreate && producto) {
      form.setFieldsValue({
        id: producto?.id,
        nombre: producto?.nombre || '',
        codigo: producto?.codigo || '',
        id_categoria: producto?.id_categoria,
        precio: producto?.precio
      });
      //Cargamos la imagen si existe
      if (producto.image) {
        setFileList([
          {
            uid: '-1',
            name: producto.image.path,
            status: 'done',
            url:`${constants.URL_IMAGE}productos/${producto.image.path}`,
            response: { 
              data: { 
                path: producto.image.path,
                nombre_archivo: producto.image.path 
              } 
            }
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [comboCategorias, producto, isCreate, open]);


  return (
    <>
      {contextHolder2}
      {contextHolder}
      <Modal
        title={titulo}
        centered
        footer={false}
        open={open}
        onCancel={toggle}
        width={{
          xs:'90%',
          md:'40%'
        }}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[16, 8]}>
            {/* ID Oculto */}
            <Form.Item hidden name="id">
              <Input type="hidden" />
            </Form.Item>

            {/* Categoría */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Categoría"
                name="id_categoria"
                rules={[{ required: true, message: "Por favor, selecciona una categoría" }]}
                validateStatus={error?.id_categoria?.length ? "error" : ""}
                help={
                  error?.id_categoria?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "15px", textAlign: "left" }}>
                      {error.id_categoria.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : null
                }
              >
                <Select
                  showSearch
                  placeholder="Selecciona una categoría"
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={comboCategorias}
                />
              </Form.Item>
            </Col>

            {/* Código */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Código producto"
                name="codigo"
                rules={[{ required: true, message: "Por favor, escriba el código" }]}
                validateStatus={error?.codigo?.length ? "error" : ""}
                help={
                  error?.codigo?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "15px" }}>
                      {error.codigo.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : null
                }
              >
                <Input placeholder="Escriba el código del producto" />
              </Form.Item>
            </Col>

            {/* Nombre */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombre producto"
                name="nombre"
                rules={[{ required: true, message: "Por favor, escriba el nombre" }]}
                validateStatus={error?.nombre?.length ? "error" : ""}
                help={
                  error?.nombre?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "15px" }}>
                      {error.nombre.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : null
                }
              >
                <Input placeholder="Escriba nombre del producto" />
              </Form.Item>
            </Col>

            {/* Precio */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Precio"
                name="precio"
                rules={[{ required: true, message: "Por favor, escriba el precio" }]}
                validateStatus={error?.precio?.length ? "error" : ""}
                help={
                  error?.precio?.length ? (
                    <ul style={{ margin: 0, paddingLeft: "15px" }}>
                      {error.precio.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  ) : null
                }
              >
                <Input type="number" step="0.01" placeholder="0.00" />
              </Form.Item>
            </Col>

            {/* Carga de Imagen */}
            <Col xs={24}>
              <Form.Item 
                label="Cargar imagen" 
              >
                <Upload
                  {...upload_props}
                  maxCount={1}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={handleBeforeUpload}
                  accept=".jpg,.jpeg,.png"
                >
                  {fileList.length >= 1 || isUploading ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Subir Imagen</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {/* Visor de Preview */}
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (v) => setPreviewOpen(v),
                    afterOpenChange: (v) => !v && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>

            {/* Botones de Acción */}
            <Col xs={24} style={{ textAlign: "right", marginTop: "15px" }}>
              <Button 
                onClick={toggle} 
                style={{ marginRight: 8 }} 
                icon={<CloseOutlined />}
              >
                Cancelar
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading} 
                icon={<SaveOutlined />}
              >
                {isCreate ? "Guardar" : "Actualizar"}
              </Button>
            </Col>
          </Row>
        </Form>

      </Modal>
    </>
  )
}
