import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import style from "./style";
import api from "../../servicos/api";
import styles from "./style";

export default function AlterarProduto({ navigation, route }) {

    const idProduto = route.params.id;
    const [nome, setNome] = useState(route.params.nome);
    const [qtde, setQtde] = useState(route.params.quantidade);


    function alterarProduto(param_id, param_nome, param_qtde) {

        const produto = {
            id: param_id,
            nome: param_nome,
            quantidade: param_qtde
        }

        try {
            const resposta = api.put("/produtos/" + param_id, produto)
        } catch (error) {
            console.log("Erro ao alterar produto: " + error.message)
        }

        navigation.navigate("ListarProduto");

    }



    return (
        <View style={style.container}>
            <Text style={style.label}>Produto</Text>
            <TextInput
                style={styles.input}
                type="text"
                placeholder="Nome do Produto"
                onChangeText={setNome}
                value={nome}
            />

            <Text style={style.label}>Quantidade</Text>
            <TextInput
                style={styles.input}
                type="text"
                keyboardType="numeric"
                onChangeText={setQtde}
                value={qtde.toString()}
            />
            <TouchableOpacity
                style={styles.buttonUpdate}
                onPress={()=>{

                    alterarProduto(idProduto, nome, qtde)

                }}
            
            >
                <Text style={styles.iconButton}>Salvar</Text>
            </TouchableOpacity>



        </View>
    );
}
