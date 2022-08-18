<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%produtos}}`.
 */
class m220817_124934_create_produtos_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%produtos}}', [
            'id' => $this->primaryKey(),
            'nome' => $this->string(255),
            'quantidade' => $this->integer(),
            'create_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
            'update_at' => $this->timestamp()->defaultValue(null)->append('ON UPDATE CURRENT_TIMESTAMP'),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%produtos}}');
    }
}
