import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, RefreshControl, SafeAreaView } from "react-native";

import api from "../../servicos/api";
import style from "./style";

import { FontAwesome } from "@expo/vector-icons";

export default function ListarProduto({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const atualizarLista = useCallback(() => {
        setRefreshing(true);
        api.get("/produtos")
            .then((response) => {

    console.log("Tipo:", typeof response.data);
    console.log("Dados:", JSON.stringify(response.data));


                // Garante que sempre será um array
                const dados = Array.isArray(response.data) ? response.data : [];
                setProdutos(dados);
            })
            .catch((error) => {
                console.log("Erro: ", error.message);
                setProdutos([]); // limpa em caso de erro
            })
            .finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            atualizarLista();
        });
        return unsubscribe;
    }, [navigation, atualizarLista]);

    const excluirProduto = async (id) => {
        try {
            await api.delete(`/produtos/${id}`);
            atualizarLista();
        } catch (error) {
            console.log("Erro ao excluir: ", error.message);
        }
    };

    const onRefresh = useCallback(() => {
        atualizarLista();
    }, [atualizarLista]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => String(item.id)}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh} 
                            colors={["#007BFF"]} // Cor do loader no Android
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={style.Produtos}>
                            <Text
                                onPress={() => navigation.navigate("AlterarProduto", {
                                    id: item.id,
                                    nome: item.nome,
                                    quantidade: item.quantidade
                                })}
                                style={style.DescriptionProduto}
                            >
                                {item.nome}
                            </Text>

                            <TouchableOpacity
                                style={style.deleteProduto}
                                onPress={() => excluirProduto(item.id)}
                            >
                                <FontAwesome
                                    name="trash"
                                    size={20}
                                    color="#007BFF"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <TouchableOpacity
                    style={style.buttonNewProduto}
                    onPress={() => navigation.navigate("IncluirProduto")}
                >
                    <Text style={style.iconButton}>+</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}