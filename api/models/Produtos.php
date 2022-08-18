<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "produtos".
 *
 * @property int $id
 * @property int $categoria_id
 * @property string|null $nome
 * @property int|null $quantidade
 * @property string $create_at
 * @property string|null $update_at
 *
 * @property Categorias $categoria
 */
class Produtos extends \yii\db\ActiveRecord
{
    const ROLE_USER = 10;
    const ROLE_STAFF = 50;
    const ROLE_ADMIN = 99;
    const STATUS_DELETED = -1;
    const STATUS_DISABLED = 0;
    const STATUS_PENDING = 1;
    const STATUS_ACTIVE = 10;
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'produtos';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['categoria_id'], 'required'],
            [['categoria_id', 'quantidade'], 'integer'],
            [['create_at', 'update_at'], 'safe'],
            [['nome'], 'string', 'max' => 255],
            [['categoria_id'], 'exist', 'skipOnError' => true, 'targetClass' => Categorias::className(), 'targetAttribute' => ['categoria_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'categoria_id' => 'Categoria ID',
            'nome' => 'Nome',
            'quantidade' => 'Quantidade',
            'create_at' => 'Create At',
            'update_at' => 'Update At',
        ];
    }

    /**
     * Gets query for [[Categoria]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getCategoria()
    {
        return $this->hasOne(Categorias::className(), ['id' => 'categoria_id']);
    }
}
