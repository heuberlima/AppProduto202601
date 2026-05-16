# Relatorio da correcao do erro `java.lang.String cannot be cast to java.lang.Double`

## 1. Problema relatado

O app abria pelo QR Code do Expo e falhava logo no inicio com o erro:

```txt
java.lang.String cannot be cast to java.lang.Double
```

Esse erro aparecia antes de qualquer uso real das telas de produto ou da API. Por isso, a investigacao focou primeiro na inicializacao do app, nas dependencias nativas do Expo/React Native e no React Navigation.

## 2. Diagnostico

O projeto usava `@react-navigation/native` e `@react-navigation/stack`, mas nao tinha todas as dependencias nativas exigidas pelo Stack Navigator instaladas no `package.json`.

As dependencias que estavam faltando eram:

```txt
react-native-gesture-handler
react-native-screens
react-native-safe-area-context
@react-native-masked-view/masked-view
```

Tambem faltava importar o `react-native-gesture-handler` no topo do arquivo de entrada do app, antes do `App` ser importado.

Esse ponto e importante porque o `@react-navigation/stack` depende de modulos nativos. Quando eles nao estao instalados ou inicializados corretamente, o erro pode aparecer logo ao abrir o app no Expo Go, antes mesmo da primeira tela funcionar.

## 3. Comandos executados

Primeiro foram instaladas as dependencias do projeto:

```powershell
npm install
```

Depois foram instaladas as dependencias nativas compativeis com a versao do Expo:

```powershell
npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-masked-view/masked-view
```

O `expo-doctor` indicou que o pacote `expo` estava em uma versao de patch abaixo da esperada:

```txt
expected: ~54.0.34
found:    54.0.33
```

Por isso, o Expo foi atualizado com:

```powershell
npx expo install expo
```

## 4. Alteracoes feitas nos arquivos

### 4.1. Arquivo `package.json`

Antes, o `package.json` estava assim na parte de dependencias:

```json
"dependencies": {
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/stack": "^7.8.11",
  "axios": "^1.15.2",
  "expo": "~54.0.33",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

Depois, ficou assim:

```json
"dependencies": {
  "@react-native-masked-view/masked-view": "0.3.2",
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/stack": "^7.8.11",
  "axios": "^1.15.2",
  "expo": "~54.0.34",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

O que mudou:

- Foi adicionado `@react-native-masked-view/masked-view`.
- Foi adicionado `react-native-gesture-handler`.
- Foi adicionado `react-native-safe-area-context`.
- Foi adicionado `react-native-screens`.
- O pacote `expo` foi atualizado de `~54.0.33` para `~54.0.34`.

Essas dependencias sao necessarias para o funcionamento correto do React Navigation Stack no React Native/Expo.

### 4.2. Arquivo `index.js`

Antes, o arquivo estava assim:

```js
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
```

Depois, ficou assim:

```js
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
```

O que mudou:

```js
import 'react-native-gesture-handler';
```

Essa linha foi adicionada no topo do arquivo. Ela precisa ficar antes do `import App from './App';`, porque o Gesture Handler deve ser carregado antes da navegacao.

## 5. Outro problema encontrado nas telas

Durante o review do projeto, foi encontrado outro problema: as tres telas principais existiam como componentes, mas nao retornavam nenhum JSX.

Isso nao era necessariamente a causa principal do erro nativo, mas depois de resolver a parte nativa poderia gerar tela em branco ou erro de renderizacao.

### 5.1. Arquivo `src/paginas/ListarProduto/index.js`

Antes:

```js
import React, {useState, useEffect, useCallback} from "react";
import { View, Text, TouchableOpacity, FlatList, RefreshControl, SafeAreaViewBase } from "react-native";

import api from "../../servicos/api";
import style from "./style";

import FontAwesome from "@expo/vector-icons";

export default function ListarProduto({}){
    
}
```

Depois:

```js
import React from "react";
import { View, Text } from "react-native";

import style from "./style";

export default function ListarProduto({}){
    return (
        <View style={style.container}>
            <Text>Lista de produtos</Text>
        </View>
    );
}
```

O que mudou:

- Foram removidos imports que ainda nao estavam sendo usados.
- Foi removido o import de `api`, porque a tela ainda nao usa a API.
- Foi removido o import de `FontAwesome`, porque ele ainda nao era usado.
- Foi adicionado um `return` com JSX basico.

### 5.2. Arquivo `src/paginas/IncluirProduto/index.js`

Antes:

```js
import React, {useState, useEffect, useCallback} from "react";
import { View, Text, TouchableOpacity, FlatList, RefreshControl, SafeAreaViewBase } from "react-native";

import api from "../../servicos/api";
import style from "./style";

import FontAwesome from "@expo/vector-icons";

export default function IncluirProduto({}){
    
}
```

Depois:

```js
import React from "react";
import { View, Text } from "react-native";

import style from "./style";

export default function IncluirProduto({}){
    return (
        <View style={style.container}>
            <Text>Incluir produto</Text>
        </View>
    );
}
```

O que mudou:

- Foram removidos imports que ainda nao estavam sendo usados.
- Foi removido o import de `api`.
- Foi removido o import de `FontAwesome`.
- Foi adicionado um `return` com JSX basico.

### 5.3. Arquivo `src/paginas/AlterarProduto/index.js`

Antes:

```js
import React, {useState, useEffect, useCallback} from "react";
import { View, Text, TouchableOpacity, FlatList, RefreshControl, SafeAreaViewBase } from "react-native";

import api from "../../servicos/api";
import style from "./style";

import FontAwesome from "@expo/vector-icons";

export default function AlterarProduto({}){
    
}
```

Depois:

```js
import React from "react";
import { View, Text } from "react-native";

import style from "./style";

export default function AlterarProduto({}){
    return (
        <View style={style.container}>
            <Text>Alterar produto</Text>
        </View>
    );
}
```

O que mudou:

- Foram removidos imports que ainda nao estavam sendo usados.
- Foi removido o import de `api`.
- Foi removido o import de `FontAwesome`.
- Foi adicionado um `return` com JSX basico.

## 6. Validacoes feitas depois da correcao

Foi executado:

```powershell
npx expo-doctor
```

Resultado:

```txt
17/17 checks passed. No issues detected!
```

Tambem foi executado:

```powershell
npx expo install --check
```

Resultado:

```txt
Dependencies are up to date
```

Depois foi gerado o bundle Android:

```powershell
npx expo export --platform android --clear
```

Resultado:

```txt
Android Bundled
Exported: dist
```

Tambem foi executado:

```powershell
npm audit --audit-level=moderate
```

Resultado:

```txt
found 0 vulnerabilities
```

## 7. Como rodar agora

Dentro da pasta do projeto:

```powershell
cd "C:\Users\Douglas Bernardes\Desktop\ProgMobileHeuber\AppProduto202601"
npm start
```

Se o Expo tentar consultar a internet e falhar, pode rodar em modo offline:

```powershell
npx expo start --clear --offline --go
```

O servidor Expo tambem foi testado localmente na porta:

```txt
http://localhost:8081
```

Na rede local usada durante o teste, o endereco para abrir no Expo Go era:

```txt
exp://10.200.3.139:8081
```

Esse IP pode mudar se a rede mudar.

## 8. Resumo do motivo da correcao

O erro acontecia logo ao ler o QR Code porque o app carregava o React Navigation Stack sem as dependencias nativas completas e sem inicializar o `react-native-gesture-handler` no ponto correto.

A correcao principal foi:

1. Instalar as dependencias nativas exigidas pelo React Navigation Stack.
2. Atualizar o Expo para a versao de patch esperada pelo SDK.
3. Importar `react-native-gesture-handler` no topo do `index.js`.
4. Corrigir as telas para retornarem JSX basico e nao ficarem vazias.

