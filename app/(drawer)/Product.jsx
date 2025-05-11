import React, {useEffect, useState} from 'react';
import {API_URL} from '../../config';

import { fetchProducts,saveProduct ,deleteProduct} from '../../services/API';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const ProductMaster = () => {
  const [products, setProducts] = useState([]);

  const [productName, setProductName] = useState('');

  const [productCode, setproductCode] = useState(null);


  const [editingProduct, setEditingProduct] = useState(null);


  
  useEffect(() => {
    const load = async () => {
      const data = await fetchProducts();
     
      setProducts(data);
    };
  
    load();
  }, [products]);



//   const handleSubmit = async () => {
//     if (!productName ) {
//       Alert.alert('Validation Error', 'Both fields are required.');
//       return;
//     }

//     const formData = {
//       newname:productName,
//       newcode:productCode
   
//     };

//     try {
//       const url = editingProduct
//         ? `${API_URL}/updateProduct/${editingProduct.code}`
//         : `${API_URL}/addproduct`;

//       const method = editingProduct ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         Alert.alert('Success', editingProduct ? 'Product updated!' : 'Product added!');
//         setProductName('');
//         setproductCode('');
//         setEditingProduct(null);
//         fetchProducts(); // refresh list
//       } else {
//         Alert.alert('Error', result?.message || 'Something went wrong.');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to submit product.');
//     }
//   };

const handleSubmit = async () => {
    if (!productName) {
      Alert.alert('Validation Error', 'Product name is required.');
      return;
    }
  
    const formData = {
      newname: productName,
      newcode: productCode,
    };
  
    const { ok, result } = await saveProduct(formData, !!editingProduct, editingProduct?.code);
  
    if (ok) {
      Alert.alert('Success', editingProduct ? 'Product updated!' : 'Product added!');
      setProductName('');
      setproductCode('');
      setEditingProduct(null);
      load(); 
    } else {
      Alert.alert('Error', result?.message || 'Failed to save product.');
    }
  };

//   const handleDelete = async (prod) => {
//     console.log("Delete function called");
  
//     const productCode = prod.code; // directly use it

//     try {
//       const url = `${API_URL}/DeleteProduct/${productCode}`;
  
//       const res = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       const result = await res.json();
  
//       if (res.ok) {
//         Alert.alert('Success', 'Product Deleted!');
//         load(); // refresh list
//       } else {
//         Alert.alert('Error', result?.message || 'Something went wrong.');
//       }
  
//     } catch (error) {
//       console.error("Delete Error:", error);
//       Alert.alert('Error', 'Failed to delete product.');
//     }
//   };
  


  const handleDelete = async (prod) => {
    try {
      await deleteProduct(prod.code); // Delete product
      Alert.alert('Success', 'Product Deleted!');
      load(); // Refresh product list
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to delete product.');
    }
  };  

  const handleEdit = (prod) => {


    console.log("hi This is clicked",prod.product_name)
    setProductName(prod.product_name);
    setproductCode(prod.code);
    setEditingProduct(prod);
  };

  

  const handleCancel = () => {
    setProductName('');

    setEditingProduct(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={setProductName}
      />
   

      <View style={styles.buttonContainer} >
        <TouchableOpacity style={styles.button}onPress={()=>handleSubmit()}>
          <Text style={styles.buttonText}>{editingProduct ? 'Update' : 'Submit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>Product List</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, {flex: 1}]}>Code</Text>
        <Text style={[styles.tableCell, {flex: 2}]}>Name</Text>
        <Text style={[styles.tableCell, {flex: 1}]}>Actions</Text>
      </View>

      <ScrollView style={styles.table}>
  {products.map((prod) => (
    <View key={prod.id} style={styles.tableRow}>
      
      {/* Product Code */}
      <Text style={[styles.tableCell, { flex: 1 }]}>{prod.code}</Text>
      
      {/* Product Name */}
      <Text style={[styles.tableCell, { flex: 3 }]}>{prod.product_name}</Text>
      
      {/* Actions (Edit + Delete) */}
      <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-between' }}>
        
        {/* Edit Button */}
        <TouchableOpacity onPress={() => handleEdit(prod)}>
          <Text style={{ color: 'blue', paddingHorizontal: 5 }}>Edit</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => handleDelete(prod)}>
          <Text style={{ color: 'red', paddingHorizontal: 5 }}>Delete</Text>
        </TouchableOpacity>

      </View>
    </View>
  ))}
</ScrollView>

    </View>
  );
};

export default ProductMaster;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
  },
});
