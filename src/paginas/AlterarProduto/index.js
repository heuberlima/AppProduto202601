import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import api from "../../servicos/api";
import style, { COLORS } from "./style";

export default function AlterarProduto({ navigation, route }) {
  const idProduto = route.params.id;
  const [nome, setNome] = useState(route.params.nome ?? "");
  const [qtde, setQtde] = useState(String(route.params.quantidade ?? ""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validar() {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";
    if (!qtde.trim()) novosErros.qtde = "Informe a quantidade.";
    else if (isNaN(Number(qtde))) novosErros.qtde = "Quantidade inválida.";
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function alterarProduto() {
    if (!validar()) return;

    setLoading(true);
    try {
      await api.put(`/produtos/${idProduto}`, {
        id: idProduto,
        nome: nome.trim(),
        quantidade: Number(qtde),
      });
      navigation.navigate("ListarProduto");
    } catch (error) {
      console.log("Erro ao alterar produto: ", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={style.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={style.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <View style={style.sectionHeader}>
            <View style={style.sectionIconWrapper}>
              <FontAwesome name="pencil" size={17} color={COLORS.primary} />
            </View>
            <View>
              <Text style={style.sectionTitle}>Editar Produto</Text>
              <Text style={style.sectionSubtitle}>ID #{idProduto}</Text>
            </View>
          </View>

          {/* Card do formulário */}
          <View style={style.card}>
            {/* Campo Nome */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Nome do Produto</Text>
              <View style={[style.inputWrapper, errors.nome && style.inputWrapperError]}>
                <FontAwesome
                  name="tag"
                  size={14}
                  color={errors.nome ? COLORS.danger : COLORS.textSecondary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="Nome do produto"
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={(v) => {
                    setNome(v);
                    if (errors.nome) setErrors((e) => ({ ...e, nome: null }));
                  }}
                  value={nome}
                  returnKeyType="next"
                />
              </View>
              {errors.nome && (
                <Text style={style.errorText}>
                  <FontAwesome name="exclamation-circle" size={11} /> {errors.nome}
                </Text>
              )}
            </View>

            {/* Campo Quantidade */}
            <View style={style.fieldGroup}>
              <Text style={style.label}>Quantidade</Text>
              <View style={[style.inputWrapper, errors.qtde && style.inputWrapperError]}>
                <FontAwesome
                  name="cubes"
                  size={14}
                  color={errors.qtde ? COLORS.danger : COLORS.textSecondary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="0"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="numeric"
                  onChangeText={(v) => {
                    setQtde(v);
                    if (errors.qtde) setErrors((e) => ({ ...e, qtde: null }));
                  }}
                  value={qtde}
                  returnKeyType="done"
                  onSubmitEditing={alterarProduto}
                />
              </View>
              {errors.qtde && (
                <Text style={style.errorText}>
                  <FontAwesome name="exclamation-circle" size={11} /> {errors.qtde}
                </Text>
              )}
            </View>
          </View>

          {/* Botões */}
          <View style={style.actions}>
            <TouchableOpacity
              style={style.buttonSecondary}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
            >
              <FontAwesome name="arrow-left" size={14} color={COLORS.textSecondary} />
              <Text style={style.buttonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[style.buttonPrimary, loading && style.buttonDisabled]}
              onPress={alterarProduto}
              activeOpacity={0.85}
              disabled={loading}
            >
              <FontAwesome name="check" size={14} color="#fff" />
              <Text style={style.buttonPrimaryText}>
                {loading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}