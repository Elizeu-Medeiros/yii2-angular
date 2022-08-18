<?php

use yii\db\Migration;

/**
 * Class m220817_173543_alter_table_produtos_table
 */
class m220817_173543_alter_table_produtos_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        //add foreign key for table `categoria_id'
        $this->addForeignKey(
            'fk_produtos_categoria_id',
            'produtos',
            'categoria_id',
            'categorias',
            'id',
            'RESTRICT'
        );
        return false;
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m220817_173543_alter_table_produtos_table cannot be reverted.\n";

        return false;
    }
    */
}
