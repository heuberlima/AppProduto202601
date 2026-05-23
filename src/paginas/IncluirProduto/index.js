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

export default function IncluirProduto({ navigation }) {
  const [param_nome, setParam_nome] = useState("");
  const [param_qtde, setParam_qtde] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validar() {
    const novosErros = {};
    if (!param_nome.trim()) novosErros.nome = "Informe o nome do produto.";
    if (!param_qtde.trim()) novosErros.qtde = "Informe a quantidade.";
    else if (isNaN(Number(param_qtde))) novosErros.qtde = "Quantidade inválida.";
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function incluirProduto() {
    if (!validar()) return;

    setLoading(true);
    try {
      await api.post("/produtos", {
        id: 0,
        nome: param_nome.trim(),
        quantidade: Number(param_qtde),
      });
      navigation.navigate("ListarProduto");
    } catch (error) {
      console.log("Erro ao incluir produto: ", error.message);
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
          {/* Cabeçalho da seção */}
          <View style={style.sectionHeader}>
            <View style={style.sectionIconWrapper}>
              <FontAwesome name="plus" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={style.sectionTitle}>Novo Produto</Text>
              <Text style={style.sectionSubtitle}>Preencha os dados abaixo</Text>
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
                  placeholder="Ex: Arroz, Caneta, Parafuso..."
                  placeholderTextColor={COLORS.placeholder}
                  onChangeText={(v) => {
                    setParam_nome(v);
                    if (errors.nome) setErrors((e) => ({ ...e, nome: null }));
                  }}
                  value={param_nome}
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
                    setParam_qtde(v);
                    if (errors.qtde) setErrors((e) => ({ ...e, qtde: null }));
                  }}
                  value={param_qtde}
                  returnKeyType="done"
                  onSubmitEditing={incluirProduto}
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
              onPress={incluirProduto}
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