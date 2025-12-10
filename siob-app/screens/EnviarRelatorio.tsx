import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput, Button, Card, Divider, IconButton, Menu } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { darkTheme } from '../theme/darkTheme';
import AnimatedDrawer from '../components/AnimatedDrawer';
import { occurrenceService, CreateOccurrenceData } from '../services/occurrenceService';
import { statsService } from '../services/statsService';

const { width, height } = Dimensions.get('window');

// Tipos de ocorrência baseados na sua entidade
const TIPOS_OCORRENCIA = [
  { id: 'acidente', nome: 'Acidente', color: '#29B6F6' },
  { id: 'resgate', nome: 'Resgate', color: '#FFB74D' },
  { id: 'incendio', nome: 'Incêndio', color: '#EF5350' },
  { id: 'atropelamento', nome: 'Atropelamento', color: '#9C27B0' },
  { id: 'outros', nome: 'Outros', color: '#4CAF50' },
];

// Status baseados na sua entidade
const STATUS_OCORRENCIA = [
  { id: 'aberto', nome: 'Aberto', cor: '#FFA726' },
  { id: 'em_andamento', nome: 'Em Andamento', cor: '#29B6F6' },
  { id: 'finalizado', nome: 'Finalizado', cor: '#66BB6A' },
  { id: 'alerta', nome: 'Alerta', cor: '#EF5350' },
];

export default function EnviarRelatorio({ navigation, route }: any) {
  const drawerRef = useRef<any>(null);

  // Estados do formulário
  const [loading, setLoading] = useState(false);
  const [municipios, setMunicipios] = useState<Array<{id: number; name: string}>>([]);
  const [viaturas, setViaturas] = useState<Array<{id: string; plate: string; name: string}>>([]);
  
  // Dados principais
  const [tipoOcorrencia, setTipoOcorrencia] = useState<string>('acidente');
  const [status, setStatus] = useState<string>('aberto');
  const [municipio, setMunicipio] = useState<string>('');
  const [bairro, setBairro] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [nomeVitima, setNomeVitima] = useState<string>('');
  const [contatoVitima, setContatoVitima] = useState<string>('');
  const [viaturaId, setViaturaId] = useState<string>('');
  const [numeroViatura, setNumeroViatura] = useState<string>('');

  // Datas
  const [dataOcorrencia, setDataOcorrencia] = useState(new Date());
  const [dataAtivacao, setDataAtivacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickingOccurrenceDate, setPickingOccurrenceDate] = useState(true);

  // Localização
  const [localizacao, setLocalizacao] = useState<{
    latitude?: number;
    longitude?: number;
    address?: string;
  } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Imagens
  const [imagens, setImagens] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Modais
  const [menuMunicipioVisible, setMenuMunicipioVisible] = useState(false);
  const [menuViaturaVisible, setMenuViaturaVisible] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
    solicitarPermissoes();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      // Carrega municípios do backend
      const municipiosData = await occurrenceService.getMunicipalities();
      setMunicipios(municipiosData);

      // Carrega viaturas
      const viaturasData = await occurrenceService.getVehicles();
      setViaturas(viaturasData);

      // Tenta preencher com o primeiro município se disponível
      if (municipiosData.length > 0) {
        setMunicipio(municipiosData[0].name);
      }

    } catch (error) {
      console.warn('Erro ao carregar dados iniciais:', error);
    }
  };

  const solicitarPermissoes = async () => {
    try {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');

      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisa de permissão para acessar fotos.');
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    }
  };

  // Formatação
  const formatarData = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatarHora = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Localização
  const obterLocalizacaoAtual = async () => {
    if (!hasLocationPermission) {
      Alert.alert('Permissão necessária', 'Ative a permissão de localização nas configurações.');
      return;
    }

    try {
      setLoadingLocation(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      setLocalizacao(coords);

      // Tenta obter endereço
      try {
        const addresses = await Location.reverseGeocodeAsync(coords);
        if (addresses.length > 0) {
          const addr = addresses[0];
          const enderecoCompleto = [
            addr.street,
            addr.district,
            addr.city,
            addr.region
          ].filter(Boolean).join(', ');

          setEndereco(enderecoCompleto);
          
          // Tenta preencher município automaticamente
          if (addr.city) {
            setMunicipio(addr.city);
          }
          if (addr.district) {
            setBairro(addr.district);
          }
        }
      } catch (geocodeError) {
        console.warn('Erro no geocoding:', geocodeError);
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
      console.error('Erro na localização:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Imagens
  const selecionarImagens = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const novasImagens = result.assets.map(asset => asset.uri);
        setImagens(prev => [...prev, ...novasImagens]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar as imagens.');
    }
  };

  const removerImagem = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index));
  };

  // Envio
  const validarFormulario = (): boolean => {
    const camposObrigatorios = [
      { valor: tipoOcorrencia, campo: 'Tipo de ocorrência' },
      { valor: municipio, campo: 'Município' },
      { valor: endereco, campo: 'Endereço' },
      { valor: descricao, campo: 'Descrição' },
    ];

    const camposFaltando = camposObrigatorios
      .filter(campo => !campo.valor)
      .map(campo => campo.campo);

    if (camposFaltando.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        `Preencha os seguintes campos:\n${camposFaltando.join('\n')}`
      );
      return false;
    }

    return true;
  };

  const enviarOcorrencia = async () => {
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      // Prepara os dados para a API
      const ocorrenciaData: CreateOccurrenceData = {
        type: tipoOcorrencia as any,
        municipality: municipio,
        neighborhood: bairro || undefined,
        address: endereco,
        latitude: localizacao?.latitude,
        longitude: localizacao?.longitude,
        occurrenceDate: dataOcorrencia.toISOString(),
        activationDate: dataAtivacao.toISOString(),
        status: status as any,
        victimName: nomeVitima || undefined,
        victimContact: contatoVitima || undefined,
        vehicleNumber: numeroViatura || undefined,
        description: descricao,
        vehicleId: viaturaId || undefined,
      };

      console.log('📤 Enviando ocorrência:', ocorrenciaData);

      // 1. Cria a ocorrência
      const ocorrenciaCriada = await occurrenceService.createOccurrence(ocorrenciaData);

      // 2. Upload de imagens (se houver)
      if (imagens.length > 0) {
        setUploadingImages(true);
        
        for (const imagemUri of imagens) {
          try {
            await occurrenceService.uploadImage(ocorrenciaCriada.id, imagemUri);
          } catch (uploadError) {
            console.warn('Erro ao fazer upload de imagem:', uploadError);
            // Continua mesmo se uma imagem falhar
          }
        }
        
        setUploadingImages(false);
      }

      // 3. Atualiza estatísticas no dashboard
      await statsService.getDashboardStats();

      // 4. Feedback de sucesso
      Alert.alert(
        'Sucesso!',
        'Ocorrência registrada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Erro ao enviar ocorrência:', error);
      
      let mensagemErro = 'Erro ao enviar ocorrência. Tente novamente.';
      
      if (error.response?.status === 400) {
        mensagemErro = error.response.data?.message || 'Dados inválidos. Verifique os campos.';
      } else if (error.response?.status === 401) {
        mensagemErro = 'Sessão expirada. Faça login novamente.';
        // Opcional: redirecionar para login
      } else if (error.message) {
        mensagemErro = error.message;
      }

      Alert.alert('Erro', mensagemErro);
      
    } finally {
      setLoading(false);
    }
  };

  // Render
  const renderMunicipioItem = ({ item }: any) => (
    <Menu.Item
      title={item.name}
      onPress={() => {
        setMunicipio(item.name);
        setMenuMunicipioVisible(false);
      }}
    />
  );

  const renderViaturaItem = ({ item }: any) => (
    <Menu.Item
      title={`${item.plate} - ${item.name}`}
      onPress={() => {
        setViaturaId(item.id);
        setMenuViaturaVisible(false);
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.background }}>
      <AnimatedDrawer ref={drawerRef} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: darkTheme.colors.surface }]}>
        <TouchableOpacity onPress={() => drawerRef.current?.toggle?.()} style={styles.menuButton}>
          <View style={styles.hamburgerIcon}>
            <View style={[styles.hamburgerLine, { backgroundColor: darkTheme.colors.onSurface }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: darkTheme.colors.onSurface }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: darkTheme.colors.onSurface }]} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: darkTheme.colors.onSurface }]}>
          Nova Ocorrência
        </Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={[styles.container, { backgroundColor: darkTheme.colors.background }]}>
        <Card style={[styles.card, { backgroundColor: darkTheme.colors.surface }]}>
          <Card.Content>
            {/* Tipo e Status */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Tipo *
                </Text>
                <View style={styles.tipoContainer}>
                  {TIPOS_OCORRENCIA.map((tipo) => (
                    <TouchableOpacity
                      key={tipo.id}
                      style={[
                        styles.tipoButton,
                        tipoOcorrencia === tipo.id && {
                          backgroundColor: tipo.color,
                          borderColor: tipo.color
                        }
                      ]}
                      onPress={() => setTipoOcorrencia(tipo.id)}
                    >
                      <Text style={[
                        styles.tipoButtonText,
                        tipoOcorrencia === tipo.id ? { color: '#fff' } : { color: tipo.color }
                      ]}>
                        {tipo.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ width: 140 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Status *
                </Text>
                <Menu
                  visible={false} // Usaremos botão customizado
                  anchor={
                    <TouchableOpacity
                      style={[styles.selectButton, { borderColor: darkTheme.colors.outline }]}
                      onPress={() => {}} // Para menu customizado
                    >
                      <Text style={{ color: darkTheme.colors.onSurface }}>
                        {STATUS_OCORRENCIA.find(s => s.id === status)?.nome || 'Selecionar'}
                      </Text>
                    </TouchableOpacity>
                  }
                >
                  {STATUS_OCORRENCIA.map((statusItem) => (
                    <Menu.Item
                      key={statusItem.id}
                      title={statusItem.nome}
                      onPress={() => setStatus(statusItem.id)}
                    />
                  ))}
                </Menu>
              </View>
            </View>

            {/* Localização */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Localização
            </Text>

            {/* Município */}
            <Text style={[styles.label, { color: darkTheme.colors.onSurface, marginTop: 8 }]}>
              Município *
            </Text>
            <Menu
              visible={menuMunicipioVisible}
              onDismiss={() => setMenuMunicipioVisible(false)}
              anchor={
                <TouchableOpacity
                  style={[styles.selectButton, { 
                    borderColor: municipio ? darkTheme.colors.primary : darkTheme.colors.outline 
                  }]}
                  onPress={() => setMenuMunicipioVisible(true)}
                >
                  <Text style={{ 
                    color: municipio ? darkTheme.colors.primary : darkTheme.colors.onSurfaceVariant 
                  }}>
                    {municipio || 'Selecionar município'}
                  </Text>
                  <IconButton icon="chevron-down" size={20} />
                </TouchableOpacity>
              }
            >
              {municipios.map((mun) => (
                <Menu.Item
                  key={mun.id}
                  title={mun.name}
                  onPress={() => {
                    setMunicipio(mun.name);
                    setMenuMunicipioVisible(false);
                  }}
                />
              ))}
              {municipios.length === 0 && (
                <Menu.Item title="Carregando..." disabled />
              )}
            </Menu>

            {/* Bairro */}
            <Text style={[styles.label, { color: darkTheme.colors.onSurface, marginTop: 8 }]}>
              Bairro
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Digite o bairro"
              value={bairro}
              onChangeText={setBairro}
              style={styles.input}
              theme={darkTheme}
            />

            {/* Endereço */}
            <Text style={[styles.label, { color: darkTheme.colors.onSurface, marginTop: 8 }]}>
              Endereço *
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Digite o endereço completo"
              value={endereco}
              onChangeText={setEndereco}
              style={styles.input}
              theme={darkTheme}
            />

            {/* Botão de localização */}
            <Button
              mode="outlined"
              icon="crosshairs-gps"
              onPress={obterLocalizacaoAtual}
              loading={loadingLocation}
              disabled={loadingLocation}
              style={{ marginTop: 8 }}
            >
              Usar minha localização
            </Button>

            {/* Datas */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Datas e Horários
            </Text>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Data da Ocorrência
                </Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setPickingOccurrenceDate(true);
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formatarData(dataOcorrencia)}</Text>
                  <IconButton icon="calendar" size={20} />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Data de Ativação
                </Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setPickingOccurrenceDate(false);
                    setShowDatePicker(true);
                  }}
                >
                  <Text>{formatarData(dataAtivacao)}</Text>
                  <IconButton icon="calendar" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Informações da Vítima */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Informações da Vítima
            </Text>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Nome
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Nome da vítima"
                  value={nomeVitima}
                  onChangeText={setNomeVitima}
                  style={styles.input}
                  theme={darkTheme}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: darkTheme.colors.onSurface }]}>
                  Contato
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Telefone"
                  value={contatoVitima}
                  onChangeText={setContatoVitima}
                  style={styles.input}
                  theme={darkTheme}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Viatura */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Viatura
            </Text>

            <Menu
              visible={menuViaturaVisible}
              onDismiss={() => setMenuViaturaVisible(false)}
              anchor={
                <TouchableOpacity
                  style={[styles.selectButton, { 
                    borderColor: viaturaId ? darkTheme.colors.primary : darkTheme.colors.outline 
                  }]}
                  onPress={() => setMenuViaturaVisible(true)}
                >
                  <Text style={{ 
                    color: viaturaId ? darkTheme.colors.primary : darkTheme.colors.onSurfaceVariant 
                  }}>
                    {viaturaId 
                      ? viaturas.find(v => v.id === viaturaId)?.plate || 'Selecionada'
                      : 'Selecionar viatura'}
                  </Text>
                  <IconButton icon="chevron-down" size={20} />
                </TouchableOpacity>
              }
            >
              {viaturas.map((viatura) => (
                <Menu.Item
                  key={viatura.id}
                  title={`${viatura.plate} - ${viatura.name}`}
                  onPress={() => {
                    setViaturaId(viatura.id);
                    setMenuViaturaVisible(false);
                  }}
                />
              ))}
              <Menu.Item
                title="Nenhuma viatura"
                onPress={() => {
                  setViaturaId('');
                  setMenuViaturaVisible(false);
                }}
              />
            </Menu>

            <TextInput
              mode="outlined"
              placeholder="Número da viatura (opcional)"
              value={numeroViatura}
              onChangeText={setNumeroViatura}
              style={[styles.input, { marginTop: 8 }]}
              theme={darkTheme}
            />

            {/* Descrição */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Descrição *
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Descreva detalhadamente a ocorrência"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={6}
              style={styles.textArea}
              theme={darkTheme}
            />

            {/* Imagens */}
            <Text style={[styles.sectionTitle, { color: darkTheme.colors.onSurface, marginTop: 16 }]}>
              Imagens ({imagens.length})
            </Text>
            
            <Button
              mode="outlined"
              icon="image"
              onPress={selecionarImagens}
              style={{ marginTop: 8 }}
            >
              Adicionar Imagens
            </Button>

            {imagens.length > 0 && (
              <View style={styles.imagesContainer}>
                {imagens.map((uri, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <IconButton
                      icon="close"
                      size={16}
                      onPress={() => removerImagem(index)}
                      style={styles.removeImageButton}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Botão Enviar */}
            <Button
              mode="contained"
              onPress={enviarOcorrencia}
              loading={loading || uploadingImages}
              disabled={loading || uploadingImages}
              style={{ marginTop: 24, backgroundColor: darkTheme.colors.primary }}
            >
              {loading ? 'Enviando...' : uploadingImages ? 'Enviando imagens...' : 'Registrar Ocorrência'}
            </Button>
          </Card.Content>
        </Card>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={pickingOccurrenceDate ? dataOcorrencia : dataAtivacao}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              if (pickingOccurrenceDate) {
                setDataOcorrencia(selectedDate);
              } else {
                setDataAtivacao(selectedDate);
              }
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuButton: {
    padding: 8,
  },
  hamburgerIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    width: '100%',
    borderRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  card: {
    borderRadius: 12,
    elevation: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  tipoButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#444',
  },
  input: {
    fontSize: 14,
  },
  textArea: {
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  imageItem: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});