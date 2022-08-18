<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%categorias}}`.
 */
class m220817_125032_create_categorias_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%categorias}}', [
            'id' => $this->primaryKey(),
            'nome' => $this->string(255),
            'create_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
            'update_at' => $this->timestamp()->defaultValue(null)->append('ON UPDATE CURRENT_TIMESTAMP'),

        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%categorias}}');
    }
}
