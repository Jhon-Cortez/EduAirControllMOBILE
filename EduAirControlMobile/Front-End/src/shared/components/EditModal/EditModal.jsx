import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import { useTheme } from '../../../context/ThemeContext'

const DATE_FORMATS = [
  { label: 'DD/MM/YYYY', example: (d) => `${d.dd}/${d.mm}/${d.yyyy}` },
  { label: 'MM/DD/YYYY', example: (d) => `${d.mm}/${d.dd}/${d.yyyy}` },
  { label: 'YYYY-MM-DD', example: (d) => `${d.yyyy}-${d.mm}-${d.dd}` },
  { label: 'DD-MM-YYYY', example: (d) => `${d.dd}-${d.mm}-${d.yyyy}` },
  { label: 'DD.MM.YYYY', example: (d) => `${d.dd}.${d.mm}.${d.yyyy}` },
  { label: 'YYYY/MM/DD', example: (d) => `${d.yyyy}/${d.mm}/${d.dd}` },
]

function getTodayParts() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  return { dd, mm, yyyy }
}

function EditModal({ isOpen, field, value, onSave, onClose }) {
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()
  const isDateFormat = field === 'dateFormat'
  const [newValue, setNewValue] = useState(value)
  const today = getTodayParts()

  const handleSave = () => {
    onSave(field, newValue)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isDateFormat ? t('editModal.dateFormatTitle') : `${t('editModal.updateTitle')} ${field}`}>
      {isDateFormat ? (
        <>
          <Text style={[styles.subtitle, { color: c.textMuted }]}>{t('editModal.dateFormatSubtitle')}</Text>
          <View style={styles.chips}>
            {DATE_FORMATS.map(({ label, example }) => (
              <Pressable
                key={label}
                style={[
                  styles.chip,
                  { borderColor: newValue === label ? c.accent : c.borderColor },
                  newValue === label && { backgroundColor: c.accentDim },
                ]}
                onPress={() => setNewValue(label)}
              >
                <Text style={[styles.chipLabel, { color: newValue === label ? c.accent : c.textPrimary }]}>{label}</Text>
                <Text style={[styles.chipExample, { color: c.textMuted }]}>{example(today)}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.preview}>
            <Text style={[styles.previewLabel, { color: c.textMuted }]}>{t('editModal.preview')}</Text>
            <Text style={[styles.previewValue, { color: c.textPrimary }]}>
              {DATE_FORMATS.find((f) => f.label === newValue)?.example(today) ?? newValue}
            </Text>
          </View>
        </>
      ) : (
        <TextInput
          value={newValue}
          onChangeText={setNewValue}
          style={[styles.input, { color: c.textPrimary, backgroundColor: c.bgInput }]}
          placeholder={field || 'Valor'}
          placeholderTextColor={c.textMuted}
        />
      )}

      <View style={styles.buttons}>
        <Button variant="ghost" onPress={onClose} style={styles.btn}>
          {t('editModal.cancel')}
        </Button>
        <Button onPress={handleSave} style={styles.btn}>
          {t('editModal.save')}
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 13, marginBottom: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 110,
    gap: 2,
  },
  chipLabel: { fontSize: 14, fontWeight: '700' },
  chipExample: { fontSize: 12 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  previewLabel: { fontSize: 13 },
  previewValue: { fontSize: 15, fontWeight: '600' },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 18,
  },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: { minWidth: 100 },
})

export default EditModal