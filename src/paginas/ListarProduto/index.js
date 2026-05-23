import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import api from "../../servicos/api";
import style, { COLORS } from "./style";

import { FontAwesome } from "@expo/vector-icons";

export default function ListarProduto({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const atualizarLista = useCallback(() => {
    setRefreshing(true);
    api
      .get("/produtos")
      .then((response) => {
        const dados = Array.isArray(response.data) ? response.data : [];
        setProdutos(dados);
      })
      .catch((error) => {
        console.log("Erro: ", error.message);
        setProdutos([]);
      })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
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

  const ListaVazia = () => (
    <View style={style.emptyContainer}>
      <FontAwesome name="inbox" size={48} color={COLORS.border} />
      <Text style={style.emptyText}>Nenhum produto cadastrado</Text>
    </View>
  );

  return (
    <SafeAreaView style={style.safeArea}>
      {/* Cabeçalho */}
      <View style={style.header}>
        <Text style={style.headerTitle}>Produtos</Text>
        <Text style={style.headerSubtitle}>
          {produtos.length} {produtos.length === 1 ? "item" : "itens"} cadastrados
        </Text>
      </View>

      <View style={style.container}>
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={style.listContent}
          ListEmptyComponent={<ListaVazia />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.card}
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate("AlterarProduto", {
                  id: item.id,
                  nome: item.nome,
                  quantidade: item.quantidade,
                })
              }
            >
              {/* Ícone do card */}
              <View style={style.cardIconWrapper}>
                <FontAwesome name="tag" size={16} color={COLORS.primary} />
              </View>

              {/* Conteúdo */}
              <View style={style.cardBody}>
                <Text style={style.cardTitle}>{item.nome}</Text>
                {item.quantidade !== undefined && (
                  <Text style={style.cardMeta}>
                    Qtd: {item.quantidade}
                  </Text>
                )}
              </View>

              {/* Botão excluir */}
              <TouchableOpacity
                style={style.deleteButton}
                onPress={() => excluirProduto(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome name="trash" size={15} color={COLORS.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />

        {/* FAB - Novo Produto */}
        <TouchableOpacity
          style={style.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("IncluirProduto")}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}