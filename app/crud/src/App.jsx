import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_URL = "https://68a02b6c6e38a02c5817eb50.mockapi.io/v1/api/products";

export default function App() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch products on load
  useEffect(() => {
    axios.get(API_URL).then((res) => setProducts(res.data));
  }, []);

  // Save new or edited product
  const handleSave = async (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing
      const res = await axios.put(`${API_URL}/${editId}`, form);
      setProducts(products.map((p) => (p.id === editId ? res.data : p)));
      setEditId(null);
    } else {
      // Add new
      const res = await axios.post(API_URL, form);
      setProducts([...products, res.data]);
    }
    setForm({ name: "", price: "", description: "" });
    setOpen(false);
  };

  // Delete product
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  // Open edit modal
  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
    setOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>

      {/* Button to open modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setForm({ name: "", price: "", description: "" });
          setEditId(null);
          setOpen(true);
        }}
      >
        ➕ Add Product
      </Button>

      {/* Cards */}
      <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
        {products.map((product) => (
          <Card key={product.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography color="text.secondary">
                💰 Price: {product.price}
              </Typography>
              <Typography variant="body2">{product.description}</Typography>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <IconButton onClick={() => handleEdit(product)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(product.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editId ? "Edit Product" : "Add Product"}
          </Typography>
          <form onSubmit={handleSave}>
            <TextField
              label="Product Name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TextField
              label="Price"
              fullWidth
              margin="normal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editId ? "Update" : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
